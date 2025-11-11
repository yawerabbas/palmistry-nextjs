/**
 * NEW PALMISTRY FEATURES - FRONTEND COMPONENTS
 * 
 * Copy these components into app/page.tsx around line 890
 * (after the mole detection section, before the processing steps carousel)
 * 
 * These components display:
 * 1. Mount Textures (grills, nets, crosses)
 * 2. Girdles (ring-like curves)
 * 3. Quadrangle (space between Heart and Head lines)
 * 4. Bracelets (wrist creases)
 */

{/* ===================================================================== */}
{/* 1. MOUNT TEXTURES SECTION */}
{/* ===================================================================== */}
{result.analysis?.mount_textures && result.analysis.mount_textures.success && (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span>🏔️</span> Mount Texture Patterns
    </h4>
    <p className="text-sm text-gray-600 mb-4">
      {result.analysis.mount_textures.overall_analysis}
    </p>
    
    <div className="space-y-3">
      {Object.entries(result.analysis.mount_textures.mounts || {}).map(([mountName, data]: [string, any]) => {
        if (data.primary_pattern === 'none') return null
        
        return (
          <div key={mountName} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold text-gray-900">{mountName} Mount</div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                data.clarity === 'clear' ? 'bg-green-100 text-green-800' :
                data.clarity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {data.clarity}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Pattern:</span>{' '}
              <span className="capitalize">{data.primary_pattern}</span>
              {data.patterns.length > 1 && (
                <span className="text-gray-500"> (+{data.patterns.length - 1} more)</span>
              )}
            </div>
            <div className="text-xs text-gray-600 mb-2 italic">
              {data.description}
            </div>
            <div className="text-xs text-purple-700 bg-purple-50 p-2 rounded border border-purple-200">
              <strong>Palmistry Meaning:</strong> {data.traditional_meaning}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-600 min-w-[70px]">Confidence:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${data.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 font-semibold min-w-[35px] text-right">
                {(data.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )
      })}
      
      {Object.values(result.analysis.mount_textures.mounts || {}).every((m: any) => m.primary_pattern === 'none') && (
        <div className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
          No distinct patterns detected on mounts - indicates smooth energy flow
        </div>
      )}
    </div>
    
    <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
      <span>🔍</span>
      <span>Detection Method: {result.analysis.mount_textures.detection_method}</span>
    </div>
  </div>
)}

{/* ===================================================================== */}
{/* 2. GIRDLES SECTION */}
{/* ===================================================================== */}
{result.analysis?.girdles && result.analysis.girdles.success && (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span>💍</span> Girdles (Ring-like Curves)
    </h4>
    <p className="text-sm text-gray-600 mb-4">
      {result.analysis.girdles.summary}
    </p>
    
    <div className="space-y-3">
      {Object.entries(result.analysis.girdles.girdles || {}).map(([girdleName, data]: [string, any]) => {
        if (!data.detected) return null
        
        return (
          <div key={girdleName} className="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold text-gray-900">Girdle of {girdleName}</div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                data.completeness === 'complete_circle' ? 'bg-green-100 text-green-800' :
                data.completeness === 'partial_arc' ? 'bg-yellow-100 text-yellow-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {data.completeness.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs text-gray-600 mb-2 italic">
              {data.description}
            </div>
            {data.traditional_meaning && (
              <div className="text-xs text-purple-700 bg-purple-50 p-2 rounded border border-purple-200">
                <strong>Palmistry Meaning:</strong> {data.traditional_meaning}
              </div>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-600 min-w-[70px]">Confidence:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${data.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 font-semibold min-w-[35px] text-right">
                {(data.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )
      })}
      
      {Object.values(result.analysis.girdles.girdles || {}).every((d: any) => !d.detected) && (
        <div className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
          No girdles detected - indicates clear energy flow without restrictions
        </div>
      )}
    </div>
    
    <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
      <span>🔍</span>
      <span>Detection Method: {result.analysis.girdles.detection_method}</span>
    </div>
  </div>
)}

{/* ===================================================================== */}
{/* 3. QUADRANGLE SECTION */}
{/* ===================================================================== */}
{result.analysis?.quadrangle && result.analysis.quadrangle.success && result.analysis.quadrangle.detected && (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span>🔷</span> Quadrangle Region (Plain of Mars)
    </h4>
    <p className="text-sm text-gray-700 mb-4">
      {result.analysis.quadrangle.description}
    </p>
    
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg text-center border border-cyan-200">
        <div className="text-xs text-gray-600 mb-1">Shape</div>
        <div className="font-semibold text-gray-900 capitalize text-sm">
          {result.analysis.quadrangle.shape}
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg text-center border border-emerald-200">
        <div className="text-xs text-gray-600 mb-1">Width</div>
        <div className="font-semibold text-gray-900 capitalize text-sm">
          {result.analysis.quadrangle.width}
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg text-center border border-pink-200">
        <div className="text-xs text-gray-600 mb-1">Area</div>
        <div className="font-semibold text-gray-900 capitalize text-sm">
          {result.analysis.quadrangle.area_classification}
        </div>
      </div>
    </div>
    
    {result.analysis.quadrangle.markings_inside && result.analysis.quadrangle.markings_inside.length > 0 && (
      <div className="mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg p-3">
        <div className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
          <span>⭐</span>
          <span>Special Markings Detected:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.analysis.quadrangle.markings_inside.map((marking: string, idx: number) => (
            <span key={idx} className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-semibold">
              {marking}
            </span>
          ))}
        </div>
      </div>
    )}
    
    <div className="text-xs text-purple-700 bg-purple-50 p-3 rounded-lg mb-3 border border-purple-200">
      <strong>Palmistry Meaning:</strong> {result.analysis.quadrangle.traditional_meaning}
    </div>
    
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 min-w-[70px]">Confidence:</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-emerald-500 h-2 rounded-full transition-all"
          style={{ width: `${result.analysis.quadrangle.confidence * 100}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 font-semibold min-w-[35px] text-right">
        {(result.analysis.quadrangle.confidence * 100).toFixed(0)}%
      </span>
    </div>
    
    <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
      <span>🔍</span>
      <span>Detection Method: {result.analysis.quadrangle.detection_method}</span>
    </div>
  </div>
)}

{/* ===================================================================== */}
{/* 4. BRACELETS SECTION */}
{/* ===================================================================== */}
{result.analysis?.bracelets && result.analysis.bracelets.success && result.analysis.bracelets.count > 0 && (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span>⛓️</span> Wrist Bracelets (Rascettes)
    </h4>
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm text-gray-700">
        {result.analysis.bracelets.summary}
      </p>
      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
        result.analysis.bracelets.overall_quality === 'Excellent' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
        result.analysis.bracelets.overall_quality === 'Good' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
        'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
      }`}>
        {result.analysis.bracelets.overall_quality}
      </span>
    </div>
    
    <div className="space-y-3">
      {result.analysis.bracelets.bracelets.map((bracelet: any, idx: number) => {
        const braceletColors = [
          'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200',
          'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
          'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200',
          'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
        ]
        const textColors = ['text-blue-900', 'text-green-900', 'text-orange-900', 'text-purple-900']
        const badgeColors = [
          'bg-blue-100 text-blue-800',
          'bg-green-100 text-green-800',
          'bg-orange-100 text-orange-800',
          'bg-purple-100 text-purple-800'
        ]
        
        return (
          <div key={idx} className={`border-2 ${braceletColors[idx % 4]} p-4 rounded-lg`}>
            <div className="flex items-start justify-between mb-2">
              <div className={`font-semibold ${textColors[idx % 4]} flex items-center gap-2`}>
                <span className={`px-2 py-0.5 rounded-full text-xs ${badgeColors[idx % 4]}`}>
                  {bracelet.number}
                </span>
                <span>Bracelet {bracelet.number}</span>
                <span className="text-xs font-normal opacity-75">({bracelet.position})</span>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  bracelet.continuity === 'continuous' ? 'bg-green-100 text-green-800' :
                  bracelet.continuity === 'mostly_continuous' ? 'bg-blue-100 text-blue-800' :
                  bracelet.continuity === 'broken' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {bracelet.continuity}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  bracelet.clarity === 'clear' ? 'bg-emerald-100 text-emerald-800' :
                  bracelet.clarity === 'moderate' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {bracelet.clarity}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-2 italic">
              {bracelet.description}
            </div>
            <div className="text-xs text-purple-700 bg-white bg-opacity-70 p-2 rounded border border-purple-200">
              <strong>Palmistry Meaning:</strong> {bracelet.traditional_meaning}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-600 min-w-[70px]">Confidence:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${bracelet.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 font-semibold min-w-[35px] text-right">
                {(bracelet.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
    
    <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
      <span>🔍</span>
      <span>Detection Method: {result.analysis.bracelets.detection_method}</span>
    </div>
  </div>
)}

