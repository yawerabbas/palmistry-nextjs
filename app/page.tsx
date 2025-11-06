'use client'

import { useState } from 'react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import { motion } from 'framer-motion'

interface ProcessingStep {
  step: number
  name: string
  description: string
  image: string
  data: any
}

interface AnalysisResult {
  success: boolean
  analysis: any  // Full analysis object from backend
  lines: any[]   // Detected lines array
  imageMeta: any // Image metadata
  imageBase64: string // Result image
  runId: string  // Run ID
  processingSteps: ProcessingStep[] // Intermediate processing steps
}

interface Point {
  x: number
  y: number
}

interface Line {
  name: string
  detected: boolean
  points: Point[]
}

// Interactive Palm Image with SVG Overlay Component - Golden Mystical Theme
function PalmImageWithSVG({ 
  imageBase64, 
  lines, 
  imageMeta 
}: { 
  imageBase64: string
  lines: Line[]
  imageMeta: any 
}) {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null)
  const [showLines, setShowLines] = useState(true)
  
  // Get image dimensions
  const imageWidth = imageMeta?.width || 1024
  const imageHeight = imageMeta?.height || 1024
  
  // Golden mystical color palette - all lines same bright gold
  const goldenBright = '#FFD700'  // Bright gold for all lines
  const goldenColors: Record<string, string> = {
    'Heart Line': goldenBright,
    'Head Line': goldenBright,
    'Life Line': goldenBright
  }
  
  // Generate SVG path from points
  const generatePath = (points: Point[]) => {
    if (!points || points.length === 0) return ''
    
    return points.map((point, index) => {
      const x = point.x * imageWidth
      const y = point.y * imageHeight
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }
  
  // Get golden color for a specific line
  const getGoldenColor = (lineName: string) => {
    return goldenColors[lineName] || '#d4af37'
  }
  
  return (
    <div className="relative bg-black rounded-xl">
      {/* Radial pulse background */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(212,175,55,0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Base Image */}
      <img
        src={imageBase64}
        alt="Palm Analysis"
        className="w-full rounded-xl shadow-2xl relative z-0"
        style={{ filter: 'brightness(0.85) contrast(1.1)' }}
      />
      
      {/* SVG Overlay with Golden Mystical Lines */}
      {showLines && (
        <svg
          className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none z-20"
          viewBox={`0 0 ${imageWidth} ${imageHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Define golden glow filters */}
          <defs>
            <filter id="golden-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur3"/>
              <feMerge>
                <feMergeNode in="blur3"/>
                <feMergeNode in="blur2"/>
                <feMergeNode in="blur1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="golden-glow-intense" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur3"/>
              <feMerge>
                <feMergeNode in="blur3"/>
                <feMergeNode in="blur2"/>
                <feMergeNode in="blur1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {lines.map((line, index) => {
            if (!line.detected || !line.points || line.points.length === 0) return null
            
            const isHovered = hoveredLine === line.name
            const pathData = generatePath(line.points)
            const delay = index * 0.15
            const lineGoldenColor = getGoldenColor(line.name)
            
            return (
              <g key={index}>
                {/* Outer glow layer - softest, largest */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke={lineGoldenColor}
                  strokeWidth={28}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#golden-glow)"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ 
                    opacity: hoveredLine && !isHovered ? [0.15, 0.25, 0.15] : [0.2, 0.4, 0.2],
                    strokeWidth: isHovered ? [32, 40, 32] : [24, 32, 24],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay
                  }}
                />
                
                {/* Middle glow layer - medium brightness */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke={lineGoldenColor}
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#golden-glow)"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ 
                    opacity: hoveredLine && !isHovered ? [0.3, 0.4, 0.3] : [0.5, 0.7, 0.5],
                    strokeWidth: isHovered ? [16, 20, 16] : [12, 16, 12],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay + 0.1
                  }}
                />
                
                {/* Core sharp line - brightest, thinnest */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke={lineGoldenColor}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ 
                    opacity: hoveredLine && !isHovered ? [0.6, 0.75, 0.6] : [0.9, 1, 0.9],
                    strokeWidth: isHovered ? [4, 6, 4] : [3, 4, 3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay + 0.2
                  }}
                />
                
                {/* Hover effect - intense glow */}
                {isHovered && (
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke={lineGoldenColor}
                    strokeWidth={40}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#golden-glow-intense)"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </g>
            )
          })}
        </svg>
      )}
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
        <motion.button
          onClick={() => setShowLines(!showLines)}
          className="backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg font-medium text-sm transition-colors"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#FFD700',
            border: `1px solid #d4af37`,
            textShadow: `0 0 10px rgba(255,215,0,0.6)`,
          }}
          whileHover={{ scale: 1.05, boxShadow: `0 0 20px rgba(255,215,0,0.8)` }}
          whileTap={{ scale: 0.95 }}
        >
          {showLines ? '✨ Hide Lines' : '✨ Show Lines'}
        </motion.button>
      </div>
      
      {/* Line Legend with Golden Theme */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {lines.map((line, index) => {
          if (!line.detected) return null
          
          const lineGoldenColor = getGoldenColor(line.name)
          const isLineHovered = hoveredLine === line.name
          
          return (
            <motion.button
              key={index}
              onMouseEnter={() => setHoveredLine(line.name)}
              onMouseLeave={() => setHoveredLine(null)}
              className="p-3 rounded-lg border-2 transition-all"
              style={{
                backgroundColor: isLineHovered ? 'rgba(255,215,0,0.15)' : 'rgba(0,0,0,0.8)',
                borderColor: isLineHovered ? lineGoldenColor : '#d4af37',
                color: lineGoldenColor,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isLineHovered ? {
                boxShadow: [`0 0 10px ${lineGoldenColor}50`, `0 0 20px ${lineGoldenColor}80`, `0 0 10px ${lineGoldenColor}50`]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: lineGoldenColor,
                    boxShadow: `0 0 8px ${lineGoldenColor}`
                  }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    boxShadow: [`0 0 5px ${lineGoldenColor}`, `0 0 12px ${lineGoldenColor}`, `0 0 5px ${lineGoldenColor}`]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
                <motion.span 
                  className="text-sm font-medium"
                  style={{ 
                    textShadow: isLineHovered ? `0 0 10px ${lineGoldenColor}80` : 'none'
                  }}
                  animate={isLineHovered ? {
                    opacity: [0.8, 1, 0.8],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {line.name}
                </motion.span>
              </div>
              <div className="text-xs mt-1" style={{ color: 'rgba(212,175,55,0.7)' }}>
                {line.points?.length || 0} points
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDocumentation, setShowDocumentation] = useState(false)
  const [compressionStatus, setCompressionStatus] = useState<string>('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setSelectedFile(file)
        setResult(null)
        setError(null)
        
        // Fix iPhone orientation issues and create preview
        // This is crucial for Safari/iOS where images can have EXIF rotation
        // Dynamic import to avoid SSR issues
        const { readAndCompressImage } = await import('browser-image-resizer')
        
        const config = {
          quality: 0.9,
          maxWidth: 800,  // For preview only
          maxHeight: 800,
          autoRotate: true,  // Automatically fix orientation
          debug: false
        }
        
        // Create a properly oriented preview
        const resizedImage = await readAndCompressImage(file, config)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(resizedImage)
      } catch (err) {
        console.error('Error processing image:', err)
        // Fallback to basic preview if orientation fix fails
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)
    setCompressionStatus('')

    try {
      // Compress image before uploading (especially important for mobile)
      const compressionOptions = {
        maxSizeMB: 1,          // Maximum file size (1MB)
        maxWidthOrHeight: 1920, // Max dimension (good balance for palm analysis)
        useWebWorker: true,     // Use web worker for better performance
        fileType: 'image/jpeg', // Convert to JPEG for better compression
        exifOrientation: 1      // Fix iPhone orientation issues
      }
      
      let fileToUpload = selectedFile
      
      // Always compress for mobile to fix orientation + size
      // This is critical for iPhone Safari which has orientation issues
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const shouldCompress = selectedFile.size > 500 * 1024 || isMobile
      
      if (shouldCompress) {
        try {
          setCompressionStatus(isMobile ? 'Optimizing image for mobile...' : 'Compressing image for faster upload...')
          fileToUpload = await imageCompression(selectedFile, compressionOptions)
          const originalMB = (selectedFile.size / 1024 / 1024).toFixed(2)
          const compressedMB = (fileToUpload.size / 1024 / 1024).toFixed(2)
          console.log('Original size:', originalMB, 'MB')
          console.log('Compressed size:', compressedMB, 'MB')
          setCompressionStatus(`Image optimized: ${originalMB}MB → ${compressedMB}MB`)
          // Wait a moment so user can see the compression message
          await new Promise(resolve => setTimeout(resolve, 800))
        } catch (compressionError) {
          console.warn('Compression failed, using original:', compressionError)
          setError('Image processing issue - trying with original image...')
          // Continue with original file if compression fails
          await new Promise(resolve => setTimeout(resolve, 1000))
          setError(null)
        }
      }
      
      setCompressionStatus('Uploading and analyzing...')

      // Convert image to base64 data URL
      const reader = new FileReader()
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(fileToUpload)
      })

      // Send the base64 image directly to Railway backend
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
      
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageDataUrl }),
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
        runId: data.runId || '',
        processingSteps: data.processingSteps || []
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
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {preview ? (
                    <div className="space-y-4">
                      <div className="max-w-full mx-auto flex justify-center">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-w-full max-h-96 w-auto h-auto object-contain rounded-lg shadow-md"
                        />
                      </div>
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
                <>
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
                        {compressionStatus || 'Analyzing... (10-30 seconds)'}
                      </span>
                    ) : (
                      '🔍 Analyze Palm'
                    )}
                  </button>
                  {loading && compressionStatus && (
                    <div className="mt-3 text-center text-sm text-blue-600 font-medium">
                      {compressionStatus}
                    </div>
                  )}
                </>
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
                  <li>• 📱 Works great on iPhone Safari - capture directly or upload from gallery</li>
                  <li>• 🔄 Images are automatically optimized and orientation-corrected</li>
                </ul>
              </div>

              {/* How It Works Section */}
              <div className="mt-8">
                <button
                  onClick={() => setShowDocumentation(!showDocumentation)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-between"
                >
                  <span>📚 How Does the Analysis Work?</span>
                  <span className="text-xl">{showDocumentation ? '▼' : '▶'}</span>
                </button>
                
                {showDocumentation && (
                  <div className="mt-4 bg-white rounded-lg p-6 border-2 border-indigo-100">
                    <h4 className="font-bold text-gray-900 mb-4">
                      🔬 6-Step AI-Powered Analysis Pipeline
                    </h4>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <strong>Hand Landmark Detection:</strong> Uses Google MediaPipe AI to detect 21 key points on your hand and fingers.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <strong>Palm Rectification:</strong> Straightens and normalizes your palm image for consistent analysis.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <strong>Line Detection:</strong> Deep learning UNet model identifies all major palm lines with high accuracy.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <strong>Line Classification:</strong> Identifies Heart, Head, and Life lines using geometric analysis.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                        <div>
                          <strong>Detailed Analysis:</strong> Analyzes hand shape, mounts, line characteristics, skin texture, joint structure, and mole detection.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</div>
                        <div>
                          <strong>Final Result:</strong> Transforms detected lines back to your original image with annotations.
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-600 italic">
                      After analysis, you'll see detailed results from each step with images and JSON data for full transparency.
                    </p>
                  </div>
                )}
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

              {/* Handedness Detection (if available) */}
              {result.analysis?.handedness && (
                <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">
                      {result.analysis.handedness.detected_hand === 'Right' ? '🤚' : '✋'}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {result.analysis.handedness.detected_hand} Hand Detected
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          result.analysis.handedness.palmistry_type === 'Active Hand' 
                            ? 'bg-orange-200 text-orange-800' 
                            : 'bg-blue-200 text-blue-800'
                        }`}>
                          {result.analysis.handedness.palmistry_type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1">
                        <strong>Palmistry Meaning:</strong> {result.analysis.handedness.meaning}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Confidence:</span>
                        <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${result.analysis.handedness.confidence * 100}%` }}
                          />
                        </div>
                        <span className="font-semibold">{(result.analysis.handedness.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg text-xs text-gray-600">
                    <strong>Note:</strong> {result.analysis.handedness.note}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.analysis?.detection_checklist?.summary?.palm_lines_detected || 0}
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

              {/* Detection Checklist */}
              {result.analysis?.detection_checklist && (
                <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span>📋</span>
                    Detection Checklist
                  </h3>
                  
                  {/* Summary Stats */}
                  {result.analysis.detection_checklist.summary && (
                    <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {result.analysis.detection_checklist.summary.detected}
                          </div>
                          <div className="text-sm text-gray-600">Detected</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-400">
                            {result.analysis.detection_checklist.summary.total_items - result.analysis.detection_checklist.summary.detected}
                          </div>
                          <div className="text-sm text-gray-600">Not Detected</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {result.analysis.detection_checklist.summary.total_items}
                          </div>
                          <div className="text-sm text-gray-600">Total Items</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hand Landmarks */}
                    {result.analysis.detection_checklist.hand_landmarks && (
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>👋</span> Hand Landmarks
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={result.analysis.detection_checklist.hand_landmarks.detected ? 'text-green-600 text-xl' : 'text-red-500 text-xl'}>
                            {result.analysis.detection_checklist.hand_landmarks.detected ? '✓' : '✗'}
                          </span>
                          <span className="text-sm text-gray-700">
                            {result.analysis.detection_checklist.hand_landmarks.status}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Palm Lines */}
                    {result.analysis.detection_checklist.palm_lines && (
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>🖐️</span> Palm Lines
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(result.analysis.detection_checklist.palm_lines).map(([lineName, lineData]: [string, any]) => (
                            <div key={lineName} className="flex items-center gap-2">
                              <span className={lineData.detected ? 'text-green-600' : 'text-red-500'}>
                                {lineData.detected ? '✓' : '✗'}
                              </span>
                              <span className="text-sm text-gray-700 capitalize">
                                {lineName.replace('_', ' ')}: {lineData.status.replace('✓ ', '').replace('✗ ', '')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Line Origins & Terminations */}
                    {result.analysis.line_origins_terminations && result.analysis.line_origins_terminations.success && (
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>🗺️</span> Line Origins & Terminations
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-xl">✓</span>
                          <span className="text-sm text-gray-700">
                            {Object.keys(result.analysis.line_origins_terminations.lines || {}).length} line(s) mapped to mounts
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Mounts */}
                    {result.analysis.detection_checklist.mounts && (
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>⛰️</span> Mounts
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(result.analysis.detection_checklist.mounts).map(([mountName, mountData]: [string, any]) => (
                            <div key={mountName} className="flex items-center gap-2">
                              <span className={mountData.detected ? 'text-green-600' : mountData.status.includes('⚠') ? 'text-yellow-500' : 'text-red-500'}>
                                {mountData.detected ? '✓' : mountData.status.includes('⚠') ? '⚠' : '✗'}
                              </span>
                              <span className="text-sm text-gray-700 capitalize">
                                {mountName}: {mountData.status.replace('✓ ', '').replace('✗ ', '').replace('⚠ ', '')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hand Characteristics */}
                    {result.analysis.detection_checklist.hand_characteristics && (
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>✋</span> Hand Characteristics
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(result.analysis.detection_checklist.hand_characteristics).map(([charName, charData]: [string, any]) => (
                            <div key={charName} className="flex items-center gap-2">
                              <span className={charData.detected ? 'text-green-600' : 'text-red-500'}>
                                {charData.detected ? '✓' : '✗'}
                              </span>
                              <span className="text-sm text-gray-700 capitalize">
                                {charName.replace('_', ' ')}: {charData.status.replace('✓ ', '').replace('✗ ', '')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mole Detection */}
                    {result.analysis.detection_checklist.mole_detection && (
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span>🔴</span> Mole Detection
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={result.analysis.detection_checklist.mole_detection.detected ? 'text-green-600 text-xl' : 'text-green-600 text-xl'}>
                            ✓
                          </span>
                          <span className="text-sm text-gray-700">
                            {result.analysis.detection_checklist.mole_detection.status}
                          </span>
                        </div>
                        {result.analysis.detection_checklist.mole_detection.count > 0 && (
                          <div className="mt-2 text-xs text-gray-600">
                            {result.analysis.detection_checklist.mole_detection.count} mole(s) found on the palm
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Processing Steps Documentation */}
              <div className="mb-8">
                <button
                  onClick={() => setShowDocumentation(!showDocumentation)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-between shadow-lg"
                >
                  <span className="text-lg">📚 Understanding the Processing Steps</span>
                  <span className="text-2xl">{showDocumentation ? '▼' : '▶'}</span>
                </button>
                
                {showDocumentation && (
                  <div className="mt-4 bg-white rounded-xl p-8 shadow-lg border-2 border-indigo-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      🔬 Technical Documentation: Palmistry Analysis Pipeline
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Step 1 Documentation */}
                      <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                          <h4 className="text-xl font-bold text-gray-900">Hand Landmark Detection</h4>
                        </div>
                        <p className="text-gray-700 mb-3">
                          <strong>Technology:</strong> Google MediaPipe Hands
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>What happens:</strong> The system uses MediaPipe's machine learning model to detect 21 hand landmarks (key points) on the palm and fingers. These landmarks include fingertips, finger joints, wrist points, and key palm areas.
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>Why it's important:</strong> These landmarks serve as anatomical reference points for all subsequent analysis. They help identify finger lengths, palm shape, and mount positions (areas of the palm associated with different characteristics in palmistry).
                        </p>
                        <p className="text-gray-700">
                          <strong>Output:</strong> 21 3D coordinates (x, y, z) representing hand landmark positions, overlaid on the original image.
                        </p>
                      </div>

                      {/* Step 2 Documentation */}
                      <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                          <h4 className="text-xl font-bold text-gray-900">Palm Image Rectification</h4>
                        </div>
                        <p className="text-gray-700 mb-3">
                          <strong>Technology:</strong> Perspective transformation using OpenCV
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>What happens:</strong> The palm image is warped and straightened to a standardized orientation. This involves detecting the palm boundary, calculating a perspective transformation matrix, and applying it to normalize the image geometry.
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>Why it's important:</strong> Palm images are rarely captured perfectly straight-on. This step corrects for camera angle, rotation, and perspective distortion, ensuring consistent analysis regardless of how the photo was taken. It's like creating a "standardized view" of the palm.
                        </p>
                        <p className="text-gray-700">
                          <strong>Output:</strong> A rectified (straightened) palm image and the 3×3 transformation matrix used for the warping operation.
                        </p>
                      </div>

                      {/* Step 3 Documentation */}
                      <div className="border-l-4 border-purple-500 pl-6 py-4 bg-purple-50 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                          <h4 className="text-xl font-bold text-gray-900">Palm Line Detection</h4>
                        </div>
                        <p className="text-gray-700 mb-3">
                          <strong>Technology:</strong> UNet Deep Learning Model (Convolutional Neural Network)
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>What happens:</strong> A UNet neural network (trained on 70 epochs) processes the rectified palm image. First, the background is removed to isolate the palm. Then, the model performs semantic segmentation to identify and highlight all major palm lines as white pixels against a dark background.
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>Why it's important:</strong> Traditional computer vision techniques struggle with palm line detection due to varying skin tones, lighting conditions, and line visibility. Deep learning excels at this task by learning patterns from thousands of examples. The UNet architecture is specifically designed for precise image segmentation tasks.
                        </p>
                        <p className="text-gray-700">
                          <strong>Output:</strong> A binary mask image showing detected palm lines, resized to 256×256 pixels for consistent processing.
                        </p>
                      </div>

                      {/* Step 4 Documentation */}
                      <div className="border-l-4 border-orange-500 pl-6 py-4 bg-orange-50 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                          <h4 className="text-xl font-bold text-gray-900">Line Classification</h4>
                        </div>
                        <p className="text-gray-700 mb-3">
                          <strong>Technology:</strong> Custom classification algorithm with contour analysis
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>What happens:</strong> The system analyzes the detected lines and classifies them into the three principal palm lines: Heart Line (top), Head Line (middle), and Life Line (curved line around the thumb). This uses geometric properties like position, orientation, and curvature to identify each line.
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>Why it's important:</strong> Detecting lines is only half the battle—knowing which line is which is crucial for palmistry interpretation. Each major line has different meanings and characteristics. The system uses spatial relationships and anatomical knowledge to correctly identify each line.
                        </p>
                        <p className="text-gray-700">
                          <strong>Output:</strong> Three classified line sets (Heart, Head, Life) with their coordinates, drawn in different colors (red, green, blue) on the rectified palm image.
                        </p>
                      </div>

                      {/* Step 5 Documentation */}
                      <div className="border-l-4 border-pink-500 pl-6 py-4 bg-pink-50 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                          <h4 className="text-xl font-bold text-gray-900">Detailed Analysis</h4>
                        </div>
                        <p className="text-gray-700 mb-3">
                          <strong>Technology:</strong> Multi-component analysis system
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>What happens:</strong> This step combines all previous data to generate comprehensive insights:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mb-3 space-y-2 ml-4">
                          <li><strong>Hand Characteristics:</strong> Analyzes palm shape, finger lengths, and overall hand geometry</li>
                          <li><strong>Mount Analysis:</strong> Identifies and evaluates the seven mounts (raised areas of the palm) associated with planetary influences in palmistry</li>
                          <li><strong>Line Interpretation:</strong> Analyzes line lengths, depths, breaks, and intersections to generate meaningful interpretations</li>
                          <li><strong>Skin Analysis:</strong> Evaluates skin color and texture properties for additional insights</li>
                          <li><strong>Joint Analysis:</strong> Examines joint structure (knotted vs smooth) indicating analytical vs intuitive traits</li>
                          <li><strong>Mole Detection:</strong> Identifies dark spots/marks on the palm using blob detection algorithms</li>
                        </ul>
                        <p className="text-gray-700 mb-3">
                          <strong>Why it's important:</strong> This is where the "intelligence" of the system shines. It doesn't just detect features—it interprets them according to palmistry principles, providing meaningful insights about personality traits, potential, and life patterns.
                        </p>
                        <p className="text-gray-700">
                          <strong>Output:</strong> Structured JSON data containing hand characteristics, mount analysis, and detailed line interpretations.
                        </p>
                      </div>

                      {/* Step 6 Documentation */}
                      <div className="border-l-4 border-indigo-500 pl-6 py-4 bg-indigo-50 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">6</div>
                          <h4 className="text-xl font-bold text-gray-900">Final Annotated Result</h4>
                        </div>
                        <p className="text-gray-700 mb-3">
                          <strong>Technology:</strong> Inverse perspective transformation
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>What happens:</strong> The classified lines (which were detected on the rectified/warped image) are transformed back to the original image's perspective. This involves calculating the inverse transformation matrix and applying it to the line coordinates, then drawing the lines on the original image with color coding.
                        </p>
                        <p className="text-gray-700 mb-3">
                          <strong>Why it's important:</strong> Users want to see results on their original photo, not a warped version. This step ensures visual continuity—the analysis results are overlaid on the familiar image they uploaded, making it easy to understand and verify the detected features.
                        </p>
                        <p className="text-gray-700">
                          <strong>Output:</strong> The original image with color-coded palm lines drawn on it, ready for display and download.
                        </p>
                      </div>

                      {/* Summary Section */}
                      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">📊 Technical Pipeline Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                          <div>
                            <strong>🤖 AI/ML Components:</strong>
                            <ul className="list-disc list-inside ml-2 mt-2">
                              <li>MediaPipe Hands (Google)</li>
                              <li>UNet Segmentation Model</li>
                              <li>Custom Classification Algorithm</li>
                            </ul>
                          </div>
                          <div>
                            <strong>🛠️ Computer Vision Techniques:</strong>
                            <ul className="list-disc list-inside ml-2 mt-2">
                              <li>Perspective Transformation</li>
                              <li>Background Removal</li>
                              <li>Contour Analysis</li>
                              <li>Geometric Feature Extraction</li>
                            </ul>
                          </div>
                        </div>
                        <p className="mt-4 text-gray-700">
                          <strong>⚡ Processing Time:</strong> Typically 10-30 seconds depending on image size and server load.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Processing Steps */}
              {result.processingSteps && result.processingSteps.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    🔄 Processing Steps Results
                  </h3>
                  <div className="space-y-6">
                    {result.processingSteps.map((step: ProcessingStep) => (
                      <div key={step.step} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-gray-200">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {step.step}
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-xl font-bold text-gray-900 mb-1">
                              {step.name}
                            </h4>
                            <p className="text-gray-700 text-sm">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Step Image */}
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">
                              📷 Image
                            </h5>
                            {step.image && (
                              <img
                                src={step.image}
                                alt={step.name}
                                className="w-full rounded-lg shadow-md border-2 border-white"
                              />
                            )}
                          </div>
                          
                          {/* Step Data */}
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">
                              📊 Data
                            </h5>
                            <div className="bg-white p-4 rounded-lg shadow-sm overflow-auto max-h-96">
                              <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                                {JSON.stringify(step.data, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    ✨ Analyzed Result with Interactive Lines
                  </h3>
                  {result.imageBase64 && (
                    <PalmImageWithSVG 
                      imageBase64={result.imageBase64}
                      lines={result.lines}
                      imageMeta={result.imageMeta}
                    />
                  )}
                </div>
              </div>

              {/* Finger Length Ratios */}
              {result.analysis?.finger_ratios && result.analysis.finger_ratios.success && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🖐️</span>
                    Finger Length Ratios Analysis
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                    {/* Finger Lengths */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">Finger Lengths (Pixels)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                          <div className="text-xs text-gray-600 mb-1">Jupiter (Index)</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {result.analysis.finger_ratios.finger_lengths.jupiter}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                          <div className="text-xs text-gray-600 mb-1">Saturn (Middle)</div>
                          <div className="text-2xl font-bold text-green-600">
                            {result.analysis.finger_ratios.finger_lengths.saturn}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
                          <div className="text-xs text-gray-600 mb-1">Sun (Ring)</div>
                          <div className="text-2xl font-bold text-red-600">
                            {result.analysis.finger_ratios.finger_lengths.sun}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
                          <div className="text-xs text-gray-600 mb-1">Mercury (Pinky)</div>
                          <div className="text-2xl font-bold text-yellow-600">
                            {result.analysis.finger_ratios.finger_lengths.mercury}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ratios */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">Finger Ratios (vs Saturn Reference)</h4>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <span className="text-gray-700">Jupiter/Saturn:</span>
                            <span className="font-bold text-blue-600">
                              {result.analysis.finger_ratios.ratios.jupiter_to_saturn}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span className="text-gray-700">Sun/Saturn:</span>
                            <span className="font-bold text-red-600">
                              {result.analysis.finger_ratios.ratios.sun_to_saturn}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                            <span className="text-gray-700">Mercury/Saturn:</span>
                            <span className="font-bold text-yellow-600">
                              {result.analysis.finger_ratios.ratios.mercury_to_saturn}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2D:4D Ratio */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">2D:4D Digit Ratio (Jupiter/Sun)</h4>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-indigo-600">
                            {result.analysis.finger_ratios.ratios.jupiter_to_sun}
                          </span>
                          <span className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                            {result.analysis.finger_ratios.ratios.jupiter_to_sun > 1.0 ? 'Higher' : 
                             result.analysis.finger_ratios.ratios.jupiter_to_sun < 0.95 ? 'Lower' : 'Balanced'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {result.analysis.finger_ratios.ratios.jupiter_to_sun > 1.0 
                            ? 'Indicates assertive nature, verbal skills, and social dominance' 
                            : result.analysis.finger_ratios.ratios.jupiter_to_sun < 0.95
                            ? 'Indicates spatial abilities, mathematical skills, and athletic prowess'
                            : 'Balanced abilities across verbal and spatial domains'}
                        </div>
                      </div>
                    </div>

                    {/* Classifications */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">Finger Classifications</h4>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {Object.entries(result.analysis.finger_ratios.classifications).map(([finger, classification]: [string, any]) => (
                            <div key={finger} className="p-2 bg-gray-50 rounded text-center">
                              <div className="font-semibold text-gray-700 capitalize">{finger}</div>
                              <div className={`text-xs font-bold ${
                                classification === 'Long' ? 'text-green-600' :
                                classification === 'Short' ? 'text-orange-600' :
                                'text-blue-600'
                              }`}>
                                {classification}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Personality Traits */}
                    {result.analysis.finger_ratios.interpretations?.personality_traits && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Personality Insights</h4>
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <ul className="space-y-2 text-sm text-gray-700">
                            {result.analysis.finger_ratios.interpretations.personality_traits.map((trait: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-indigo-600 mt-1">•</span>
                                <span>{trait}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fingertip Shapes */}
              {result.analysis?.fingertip_shapes && result.analysis.fingertip_shapes.success && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>👆</span>
                    Fingertip Shape Analysis
                  </h3>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                    <div className="mb-4 text-sm text-gray-700">
                      <strong>Computer Vision Analysis:</strong> Fingertip contours analyzed for shape classification
                    </div>
                    
                    {/* Fingertip Classifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                      {Object.entries(result.analysis.fingertip_shapes.fingers).map(([fingerName, fingerData]: [string, any]) => {
                        if (!fingerData.success) return null;
                        
                        const shapeColors: Record<string, string> = {
                          "Pointed/Conic": "from-purple-100 to-purple-200 border-purple-400",
                          "Square": "from-orange-100 to-orange-200 border-orange-400",
                          "Spatulate": "from-green-100 to-green-200 border-green-400",
                          "Intermediate": "from-cyan-100 to-cyan-200 border-cyan-400"
                        };
                        
                        const colorClass = shapeColors[fingerData.classification] || "from-gray-100 to-gray-200 border-gray-400";
                        
                        return (
                          <div key={fingerName} className={`bg-gradient-to-br ${colorClass} p-4 rounded-xl border-2 shadow-sm`}>
                            <div className="text-xs text-gray-600 mb-1 capitalize">{fingerName}</div>
                            <div className="text-lg font-bold text-gray-900 mb-2">
                              {fingerData.classification}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gray-700">Confidence:</span>
                              <div className="flex-1 bg-white rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${fingerData.confidence * 100}%` }}
                                />
                              </div>
                              <span className="font-semibold">{Math.round(fingerData.confidence * 100)}%</span>
                            </div>
                            {fingerData.characteristics && fingerData.characteristics.length > 0 && (
                              <div className="mt-2 text-xs text-gray-600">
                                {fingerData.characteristics[0]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Shape Type Legend */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">Shape Types & Meanings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-purple-400 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-purple-700">Pointed/Conic</div>
                            <div className="text-gray-600 text-xs">Idealistic, artistic, intuitive personality</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-orange-400 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-orange-700">Square</div>
                            <div className="text-gray-600 text-xs">Practical, logical, methodical nature</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-green-700">Spatulate</div>
                            <div className="text-gray-600 text-xs">Active, energetic, innovative spirit</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Interpretations */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3">Personality Insights by Finger</h4>
                      <div className="space-y-3">
                        {Object.entries(result.analysis.fingertip_shapes.fingers).map(([fingerName, fingerData]: [string, any]) => {
                          if (!fingerData.success || !fingerData.interpretation) return null;
                          
                          return (
                            <div key={fingerName} className="border-l-4 border-purple-400 pl-3">
                              <div className="font-semibold text-gray-900 capitalize mb-1">
                                {fingerName} - {fingerData.classification}
                              </div>
                              <ul className="text-sm text-gray-700 space-y-1">
                                {fingerData.interpretation.slice(0, 3).map((insight: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-purple-600 mt-0.5">•</span>
                                    <span>{insight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Finger Flexibility */}
              {result.analysis?.finger_flexibility && result.analysis.finger_flexibility.success && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🤲</span>
                    Finger Flexibility Analysis
                  </h3>
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200">
                    {/* Overall Flexibility */}
                    {result.analysis.finger_flexibility.overall_flexibility && (
                      <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3">Overall Hand Flexibility</h4>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {result.analysis.finger_flexibility.overall_flexibility.overall_classification}
                            </div>
                            <div className="text-sm text-gray-600">
                              Score: {result.analysis.finger_flexibility.overall_flexibility.overall_score}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Flexibility Level</div>
                            <div className="w-48 bg-gray-200 rounded-full h-4">
                              <div 
                                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-4 rounded-full"
                                style={{ width: `${result.analysis.finger_flexibility.overall_flexibility.overall_score * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-teal-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Personality Insight:</strong> {result.analysis.finger_flexibility.overall_flexibility.personality_trait}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Individual Fingers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                      {Object.entries(result.analysis.finger_flexibility.fingers).map(([fingerName, fingerData]: [string, any]) => {
                        if (!fingerData.success) return null;
                        
                        const flexColors: Record<string, string> = {
                          "Stiff/Straight": "from-red-100 to-red-200 border-red-400",
                          "Normal": "from-yellow-100 to-yellow-200 border-yellow-400",
                          "Flexible": "from-green-100 to-green-200 border-green-400",
                          "Very Flexible": "from-purple-100 to-purple-200 border-purple-400"
                        };
                        
                        const colorClass = flexColors[fingerData.classification] || "from-gray-100 to-gray-200 border-gray-400";
                        
                        return (
                          <div key={fingerName} className={`bg-gradient-to-br ${colorClass} p-4 rounded-xl border-2 shadow-sm`}>
                            <div className="text-xs text-gray-600 mb-1 capitalize">{fingerName}</div>
                            <div className="text-sm font-bold text-gray-900 mb-2">
                              {fingerData.classification}
                            </div>
                            <div className="text-xs text-gray-700 mb-2">
                              Score: {fingerData.flexibility_score}
                            </div>
                            {fingerData.joint_angles && (
                              <div className="text-xs text-gray-600 space-y-1">
                                {Object.entries(fingerData.joint_angles).map(([joint, angle]: [string, any]) => (
                                  <div key={joint} className="flex justify-between">
                                    <span className="uppercase">{joint}:</span>
                                    <span className="font-semibold">{angle}°</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Flexibility Scale Legend */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">Flexibility Scale & Meanings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-red-400 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-red-700">Stiff/Straight</div>
                            <div className="text-gray-600 text-xs">Firm principles, structured approach</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-yellow-400 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-yellow-700">Normal</div>
                            <div className="text-gray-600 text-xs">Balanced, adaptable when needed</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-green-700">Flexible</div>
                            <div className="text-gray-600 text-xs">Open-minded, adaptable, creative</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-purple-400 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-purple-700">Very Flexible</div>
                            <div className="text-gray-600 text-xs">Highly adaptable, spontaneous</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Interpretations */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3">Personality Insights by Finger</h4>
                      <div className="space-y-3">
                        {Object.entries(result.analysis.finger_flexibility.fingers).map(([fingerName, fingerData]: [string, any]) => {
                          if (!fingerData.success || !fingerData.interpretation) return null;
                          
                          return (
                            <div key={fingerName} className="border-l-4 border-green-400 pl-3">
                              <div className="font-semibold text-gray-900 capitalize mb-1">
                                {fingerName} - {fingerData.classification}
                              </div>
                              <ul className="text-sm text-gray-700 space-y-1">
                                {fingerData.interpretation.slice(0, 3).map((insight: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">•</span>
                                    <span>{insight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Age Mapping on Lines */}
              {result.analysis?.age_mapping && result.analysis.age_mapping.success && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>⏳</span>
                    Age Timeline Mapping on Palm Lines
                  </h3>
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-200">
                    {/* Summary */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                      <h4 className="font-bold text-gray-900 mb-2">Summary</h4>
                      <p className="text-sm text-gray-700">{result.analysis.age_mapping.summary}</p>
                      <div className="mt-3 text-xs text-gray-600">
                        Each line has 100 evenly-spaced points with precise age values. This allows you to determine the age at any point along a line.
                      </div>
                    </div>

                    {/* Line Age Ranges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {Object.entries(result.analysis.age_mapping.lines).map(([lineName, lineData]: [string, any]) => {
                        const lineColors: Record<string, string> = {
                          "Heart Line": "from-yellow-100 to-amber-200 border-yellow-400",
                          "Head Line": "from-orange-100 to-orange-200 border-orange-400",
                          "Life Line": "from-green-100 to-lime-200 border-green-400"
                        };
                        const colorClass = lineColors[lineName] || "from-gray-100 to-gray-200 border-gray-400";
                        
                        return (
                          <div key={lineName} className={`bg-gradient-to-br ${colorClass} p-5 rounded-xl border-2 shadow-sm`}>
                            <h4 className="font-bold text-lg text-gray-900 mb-3">{lineName}</h4>
                            <div className="text-center mb-3">
                              <div className="text-3xl font-bold text-gray-900">
                                {lineData.age_range.min.toFixed(0)} - {lineData.age_range.max.toFixed(0)}
                              </div>
                              <div className="text-sm text-gray-600">years</div>
                            </div>
                            <div className="bg-white bg-opacity-70 p-3 rounded-lg text-sm">
                              <div className="text-gray-700 mb-1">
                                <strong>Points Mapped:</strong> {lineData.normalized_points_count}
                              </div>
                              <div className="text-gray-700">
                                <strong>Original Points:</strong> {lineData.original_points_count}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Sample Age Points for Each Line */}
                    <div className="space-y-4">
                      {Object.entries(result.analysis.age_mapping.lines).map(([lineName, lineData]: [string, any]) => (
                        <div key={lineName} className="bg-white p-5 rounded-xl shadow-sm">
                          <h5 className="font-semibold text-gray-900 mb-3">{lineName} - Sample Age Points</h5>
                          <div className="overflow-x-auto">
                            <div className="flex gap-3 min-w-max pb-2">
                              {lineData.age_mapped_points
                                .filter((_: any, idx: number) => idx % 10 === 0) // Show every 10th point
                                .map((point: any) => (
                                  <div key={point.index} className="flex-shrink-0 bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-200 text-center min-w-[100px]">
                                    <div className="text-xs text-gray-600 mb-1">Point {point.index}</div>
                                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                                      {point.age.toFixed(0)}
                                    </div>
                                    <div className="text-xs text-gray-500">years</div>
                                    <div className="text-xs text-gray-400 mt-2">
                                      ({point.x.toFixed(0)}, {point.y.toFixed(0)})
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-gray-600 text-center">
                            Scroll to see age progression along the line →
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Age Mapping Info */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mt-6">
                      <h4 className="font-bold text-gray-900 mb-3">📚 How Age Mapping Works</h4>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-0.5">1.</span>
                          <div>
                            <strong>Skeletonization:</strong> The detected line is thinned to single-pixel width for precise measurement
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-0.5">2.</span>
                          <div>
                            <strong>Path Extraction:</strong> The skeleton is converted into an ordered sequence of coordinates
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-0.5">3.</span>
                          <div>
                            <strong>Normalization:</strong> The path is resampled to exactly 100 evenly-spaced points using spline interpolation
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-0.5">4.</span>
                          <div>
                            <strong>Age Assignment:</strong> Each point is assigned an age based on traditional palmistry age ranges
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Traditional Age Ranges */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mt-4">
                      <h4 className="font-bold text-gray-900 mb-3">🔮 Traditional Palmistry Age Ranges</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="font-semibold text-yellow-800 mb-1">Heart Line</div>
                          <div className="text-gray-700">Ages 70 → 0 years</div>
                          <div className="text-xs text-gray-600 mt-1">Reads from pinky to index (reversed)</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="font-semibold text-orange-800 mb-1">Head Line</div>
                          <div className="text-gray-700">Ages 0 → 80 years</div>
                          <div className="text-xs text-gray-600 mt-1">Reads from index to outer palm</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="font-semibold text-green-800 mb-1">Life Line</div>
                          <div className="text-gray-700">Ages 0 → 100 years</div>
                          <div className="text-xs text-gray-600 mt-1">Reads downward from between thumb/index</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Line Origins & Terminations Analysis */}
              {result.analysis?.line_origins_terminations && result.analysis.line_origins_terminations.success && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🗺️</span>
                    Line Origins & Terminations
                  </h3>
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200">
                    {/* Summary */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                      <h4 className="font-bold text-gray-900 mb-2">Summary</h4>
                      <p className="text-sm text-gray-700">{result.analysis.line_origins_terminations.summary}</p>
                      <div className="mt-3 flex gap-4 text-sm">
                        <div className="text-gray-600">
                          <strong>Mount Regions:</strong> {Object.keys(result.analysis.line_origins_terminations.mount_regions || {}).length}
                        </div>
                        <div className="text-gray-600">
                          <strong>Lines Analyzed:</strong> {Object.keys(result.analysis.line_origins_terminations.lines || {}).length}
                        </div>
                      </div>
                    </div>

                    {/* Line Details */}
                    <div className="space-y-4">
                      {Object.entries(result.analysis.line_origins_terminations.lines).map(([lineName, lineData]: [string, any]) => (
                        <div key={lineName} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-amber-400">
                          <h4 className="font-bold text-lg text-gray-900 mb-4">{lineName}</h4>
                          
                          {/* Origin and Termination */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Origin */}
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="font-semibold text-green-800">Origin (Start)</div>
                              </div>
                              <div className="text-sm space-y-1">
                                <div className="text-gray-900 font-medium">{lineData.origin.mount_name}</div>
                                <div className="text-gray-600 text-xs">{lineData.origin.description}</div>
                                <div className="text-gray-500 text-xs">
                                  Position: ({lineData.origin.coordinates[0]}, {lineData.origin.coordinates[1]})
                                </div>
                              </div>
                            </div>

                            {/* Termination */}
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="font-semibold text-red-800">Termination (End)</div>
                              </div>
                              <div className="text-sm space-y-1">
                                <div className="text-gray-900 font-medium">{lineData.termination.mount_name}</div>
                                <div className="text-gray-600 text-xs">{lineData.termination.description}</div>
                                <div className="text-gray-500 text-xs">
                                  Position: ({lineData.termination.coordinates[0]}, {lineData.termination.coordinates[1]})
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Line Info */}
                          <div className="flex gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                            <div>
                              <strong>Line Length:</strong> {lineData.line_length} pixels
                            </div>
                            <div>
                              <strong>Points:</strong> {lineData.total_points}
                            </div>
                          </div>

                          {/* Palmistry Interpretation */}
                          {lineData.interpretation && (
                            <div className="space-y-3">
                              <h5 className="font-semibold text-gray-900">Palmistry Interpretation</h5>
                              
                              {lineData.interpretation.origin_meaning && lineData.interpretation.origin_meaning.length > 0 && (
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <div className="text-sm font-semibold text-green-800 mb-1">Origin Meaning:</div>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {lineData.interpretation.origin_meaning.map((meaning: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">•</span>
                                        <span>{meaning}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {lineData.interpretation.termination_meaning && lineData.interpretation.termination_meaning.length > 0 && (
                                <div className="bg-red-50 p-3 rounded-lg">
                                  <div className="text-sm font-semibold text-red-800 mb-1">Termination Meaning:</div>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {lineData.interpretation.termination_meaning.map((meaning: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-red-600 mt-0.5">•</span>
                                        <span>{meaning}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {lineData.interpretation.overall_meaning && lineData.interpretation.overall_meaning.length > 0 && (
                                <div className="bg-amber-50 p-3 rounded-lg">
                                  <div className="text-sm font-semibold text-amber-800 mb-1">Overall Significance:</div>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {lineData.interpretation.overall_meaning.map((meaning: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">•</span>
                                        <span>{meaning}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Mount Regions Legend */}
                    {result.analysis.line_origins_terminations.mount_regions && (
                      <div className="bg-white p-4 rounded-xl shadow-sm mt-6">
                        <h4 className="font-bold text-gray-900 mb-3">Palm Mount Regions</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                          {Object.entries(result.analysis.line_origins_terminations.mount_regions).map(([mountKey, mountData]: [string, any]) => (
                            <div key={mountKey} className="bg-gray-50 p-2 rounded-lg">
                              <div className="font-semibold text-gray-800">{mountData.name}</div>
                              <div className="text-xs text-gray-600">{mountData.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mole Detection Details */}
              {result.analysis?.mole_detection && result.analysis.mole_detection.success && result.analysis.mole_detection.count > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🔴</span>
                    Mole Detection Results
                  </h3>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Mole Count */}
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-red-600 mb-2">
                          {result.analysis.mole_detection.count}
                        </div>
                        <div className="text-gray-700 font-medium">Moles Detected</div>
                      </div>

                      {/* Detection Parameters */}
                      {result.analysis.mole_detection.detection_params && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <h5 className="font-bold text-gray-900 mb-2">Detection Parameters</h5>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Min Area: {result.analysis.mole_detection.detection_params.min_area}px</div>
                            <div>Max Area: {result.analysis.mole_detection.detection_params.max_area}px</div>
                            <div>Min Circularity: {result.analysis.mole_detection.detection_params.min_circularity}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Individual Moles */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h5 className="font-bold text-gray-900 mb-3">Detected Moles</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {result.analysis.mole_detection.moles.map((mole: any, idx: number) => (
                          <div key={idx} className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-gray-900">Mole #{idx + 1}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                mole.size_class === 'Large' ? 'bg-red-100 text-red-700' :
                                mole.size_class === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {mole.size_class}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Position: ({mole.center[0]}, {mole.center[1]})</div>
                              <div>Area: {mole.area.toFixed(1)}px²</div>
                              <div>Circularity: {mole.circularity}</div>
                              <div>Confidence: <span className={
                                mole.confidence === 'High' ? 'text-green-600 font-semibold' :
                                mole.confidence === 'Medium' ? 'text-orange-600' :
                                'text-gray-600'
                              }>{mole.confidence}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
