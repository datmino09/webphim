'use client'
import React from 'react'
import { PlayCircle, X } from 'lucide-react'

export default function ContinueWatchingBanner({ episodeName, serverName, onContinue, onDismiss }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between gap-4 bg-gray-900 border border-yellow-500/40 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <PlayCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p className="text-sm text-gray-300 truncate">
            Bạn đang xem dở{' '}
            <span className="text-white font-semibold">{episodeName}</span>
            {serverName ? (
              <span className="text-gray-400"> ({serverName})</span>
            ) : null}
            . Bạn có muốn tiếp tục xem không?
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onContinue}
            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold rounded-lg transition-colors"
          >
            Tiếp tục xem
          </button>
          <button
            onClick={onDismiss}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            title="Xem từ đầu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
