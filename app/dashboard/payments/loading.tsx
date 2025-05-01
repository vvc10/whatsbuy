export default function Loading() {
  return (
    <div className="flex justify-center items-center h-20">
    <div className="relative h-6 w-6">
      {/* Full circle (moon base) */}
      <div className="absolute rounded-full h-full w-full border border-gray-300"></div>
      
      {/* Crescent shape (rotating part) */}
      <div className="animate-spin absolute rounded-full h-full w-full border-t border-b border-l border-green-500 border-r-0 
                      left-[-1px] top-[-1px] overflow-hidden">
        <div className="absolute right-0 h-full w-1/2 bg-white"></div>
      </div>
    </div>
  </div>
  )}
