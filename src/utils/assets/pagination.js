const applyPagination = async (query, page = 1, perPage = 10) => {
    const skip = (page - 1) * perPage;
    const results = await query.skip(skip).limit(perPage);

    const totalCount = await query.model.countDocuments();

    const totalPages = Math.ceil(totalCount / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
        data: results,
        pagination: {
            totalCount,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPreviousPage
        }
    };
}

export default applyPagination