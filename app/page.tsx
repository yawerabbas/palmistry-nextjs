'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AnalysisResult {
  success: boolean
  images: {
    final: string
    detected_lines: string
    rectified: string
  }
  analysis: {
    lines_detected: number
    lines: Array<{
      name: string
      points: number
    }>
  }
  original_size: string
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    try {
      // Step 1: Upload image to our Next.js API to get a public URL
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }
      
      const { imageUrl } = await uploadResponse.json()

      // Step 2: Send the image URL to Railway backend
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      
      // Transform response to match expected format
      setResult({
        success: true,
        images: {
          final: data.imageBase64?.replace('data:image/jpeg;base64,', '') || '',
          detected_lines: '',
          rectified: ''
        },
        analysis: {
          lines_detected: data.lines?.length || 0,
          lines: data.lines || []
        },
        original_size: data.imageMeta?.size || 'Unknown'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span>🖐️</span>
            Palmistry AI Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Advanced palm reading powered by deep learning and computer vision
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Upload Section */}
        {!result && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upload Palm Image
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {preview ? (
                    <div className="space-y-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-md mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-6xl">📸</div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Click to upload
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {selectedFile && (
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="mt-6 w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Analyzing... (10-30 seconds)
                    </span>
                  ) : (
                    '🔍 Analyze Palm'
                  )}
                </button>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  ❌ {error}
                </div>
              )}

              {/* Tips */}
              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">
                  💡 Tips for Best Results
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Use good lighting</li>
                  <li>• Keep hand flat</li>
                  <li>• Spread fingers slightly</li>
                  <li>• Use plain background</li>
                  <li>• Ensure palm faces camera</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setResult(null)
                  setPreview(null)
                  setSelectedFile(null)
                }}
                className="bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow font-semibold text-gray-700"
              >
                ← Analyze Another Image
              </button>
            </div>

            {/* Success Message */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center gap-3">
                <span>✅</span>
                Analysis Complete!
              </h2>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.analysis.lines_detected}
                  </div>
                  <div className="text-gray-700 font-medium">Lines Detected</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">1024×1024</div>
                  <div className="text-gray-700 font-medium">Normalized</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">UNet</div>
                  <div className="text-gray-700 font-medium">AI Model</div>
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    📥 Original Image
                  </h3>
                  <img
                    src={preview!}
                    alt="Original"
                    className="w-full rounded-xl shadow-md"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    ✨ Analyzed Result
                  </h3>
                  <img
                    src={`data:image/png;base64,${result.images.final}`}
                    alt="Result"
                    className="w-full rounded-xl shadow-md"
                  />
                </div>
              </div>

              {/* Line Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.analysis.lines.map((line, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl"
                  >
                    <div className="text-lg font-bold text-gray-900 mb-2">
                      {line.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {line.points} points detected
                    </div>
                  </div>
                ))}
              </div>

              {/* Download Button */}
              <div className="mt-8">
                <a
                  href={`data:image/png;base64,${result.images.final}`}
                  download="palmistry-result.png"
                  className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  📥 Download Result
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          🖐️ Palmistry AI • Powered by Deep Learning & Computer Vision
        </div>
      </footer>
    </main>
  )
}
