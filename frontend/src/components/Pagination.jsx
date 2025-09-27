import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, scrollTarget }) => {
    const handlePageChange = (page) => {
        onPageChange(page);

        requestAnimationFrame(() => {
            if (scrollTarget?.current) {
                scrollTarget.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    };

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-1 border rounded mx-1 ${
                    currentPage === i ? "bg-red-600 text-white" : "bg-black border-white text-white hover:bg-gray-800"
                }`}
            >
                {i}
            </button>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded border-white text-white hover:bg-gray-800 disabled:opacity-50"
            >
                Prev
            </button>

            {pages}

            <button
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded border-white text-white hover:bg-gray-800 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
