'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AnalysisResult {
  success: boolean
  analysis: any  // Full analysis object from backend
  lines: any[]   // Detected lines array
  imageMeta: any // Image metadata
  imageBase64: string // Result image
  runId: string  // Run ID
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
      
      // Store the complete backend response
      setResult({
        success: true,
        analysis: data.analysis || {},
        lines: data.lines || [],
        imageMeta: data.imageMeta || {},
        imageBase64: data.imageBase64 || '',
        runId: data.runId || ''
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

              {/* Run ID */}
              <div className="mb-6 text-sm text-gray-600">
                Run ID: <code className="bg-gray-100 px-2 py-1 rounded">{result.runId}</code>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.lines?.length || 0}
                  </div>
                  <div className="text-gray-700 font-medium">Lines Detected</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">
                    {result.imageMeta?.size || '1024×1024'}
                  </div>
                  <div className="text-gray-700 font-medium">Image Size</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">AI</div>
                  <div className="text-gray-700 font-medium">Powered</div>
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
                  {result.imageBase64 && (
                    <img
                      src={result.imageBase64}
                      alt="Result"
                      className="w-full rounded-xl shadow-md"
                    />
                  )}
                </div>
              </div>

              {/* Full Analysis Data */}
              {result.analysis && Object.keys(result.analysis).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    📊 Analysis Data
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-xl overflow-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {JSON.stringify(result.analysis, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Line Details */}
              {result.lines && result.lines.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🖐️ Detected Lines
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.lines.map((line: any, i: number) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-gray-200"
                      >
                        <div className="text-lg font-bold text-gray-900 mb-3">
                          Line {i + 1}
                        </div>
                        <div className="text-sm text-gray-700 space-y-2">
                          {Object.entries(line).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-semibold">{key}:</span>{' '}
                              <span className="text-gray-600">
                                {typeof value === 'object' 
                                  ? JSON.stringify(value) 
                                  : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Metadata */}
              {result.imageMeta && Object.keys(result.imageMeta).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🖼️ Image Metadata
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.imageMeta).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">{key}:</span>
                          <span className="text-gray-600">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Download Button */}
              {result.imageBase64 && (
                <div className="mt-8">
                  <a
                    href={result.imageBase64}
                    download="palmistry-result.png"
                    className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    📥 Download Result
                  </a>
                </div>
              )}
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
