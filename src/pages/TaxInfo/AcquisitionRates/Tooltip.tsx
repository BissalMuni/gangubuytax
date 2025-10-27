import React, { useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  content: string[];
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showBelow, setShowBelow] = useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  if (!content || content.length === 0) {
    return <>{children}</>;
  }

  // 툴팁 위치 계산
  useLayoutEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const PADDING = 20;

      let top = triggerRect.top - tooltipRect.height - 8; // 위쪽에 표시 (기본)
      let left = triggerRect.left + triggerRect.width / 2;
      let below = false;

      // 상단 넘침 체크
      if (top < PADDING) {
        top = triggerRect.bottom + 8; // 아래쪽에 표시
        below = true;
      }

      // 하단 넘침 체크
      if (top + tooltipRect.height > window.innerHeight - PADDING && !below) {
        // 위쪽 공간이 충분하지 않으면 아래쪽에 표시
        top = triggerRect.bottom + 8;
        below = true;
      }

      // 좌측 넘침 체크
      if (left - tooltipRect.width / 2 < PADDING) {
        left = PADDING + tooltipRect.width / 2;
      }

      // 우측 넘침 체크
      if (left + tooltipRect.width / 2 > window.innerWidth - PADDING) {
        left = window.innerWidth - PADDING - tooltipRect.width / 2;
      }

      setTooltipPosition({ top, left });
      setShowBelow(below);
    }
  }, [isVisible]);

  const tooltipContent = isVisible && (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg w-96 whitespace-normal"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'none'
      }}
    >
      <div className="space-y-2">
        {content.map((item, index) => (
          <div key={index} className="border-b border-gray-600 pb-2 last:border-b-0 last:pb-0">
            {typeof item === 'string' ? item :
              typeof item === 'object' && item !== null ?
                ((item as any).clause ? (
                  <div>
                    <div className="font-semibold text-yellow-300">{(item as any).clause}</div>
                    <div className="mt-1 pl-2">
                      {Array.isArray((item as any).content) ? (
                        <ul className="list-disc list-inside space-y-1">
                          {((item as any).content as string[]).map((contentItem: string, idx: number) => (
                            <li key={idx} className="text-gray-200">{contentItem}</li>
                          ))}
                        </ul>
                      ) : (
                        (item as any).content || ''
                      )}
                    </div>
                  </div>
                ) : JSON.stringify(item)) :
                String(item)}
          </div>
        ))}
      </div>
      {/* 화살표 */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 ${
          showBelow
            ? 'bottom-full border-b-4 border-l-transparent border-r-transparent border-b-gray-800'
            : 'top-full border-t-4 border-l-transparent border-r-transparent border-t-gray-800'
        }`}
      ></div>
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-block cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {typeof document !== 'undefined' && ReactDOM.createPortal(
        tooltipContent,
        document.body
      )}
    </>
  );
};

export default Tooltip;
