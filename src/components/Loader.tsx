const Loader = () => {
    return (
        <div className={`bg-black w-full h-screen fixed top-0 left-0 z-50 flex items-center justify-center opacity-100 pointer-events-auto`}>
            <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div
                    className="w-20 h-20 border-4 border-transparent text-[#fff] text-4xl animate-spin flex items-center justify-center border-t-[#fff] rounded-full"
                >
                    <div
                        className="w-16 h-16 border-4 border-transparent text-[#f1a274] text-2xl animate-spin flex items-center justify-center border-t-[#f1a274] rounded-full"
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default Loader