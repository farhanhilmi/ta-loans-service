import config from '../config/index.js';

export const formatData = (data) => {
    return data.map((item) => {
        return {
            id: item._id,
            name: item.name,
            email: item.email,
            role: item.role,
        };
    });
};

export const responseData = (
    data = [],
    status = 'OK',
    message = 'success',
    meta = {},
) => {
    return {
        status,
        message,
        data,
        meta,
    };
};

export const formatDataPagination = (
    data,
    page,
    limit,
    totalItems,
    sort = null,
    order = null,
    query = null,
) => {
    const URL = `${config.PROJECT_URL}/available`;
    const isNextPage = totalItems > page * limit;
    const isPreviousPage = page > 1;

    const paginationURL = (pageNumber) => {
        query = query ? `&q=${query.trim().replace(/\s/g, '+')}` : '';
        console.log('QUERY', query);
        if (sort && order) {
            return `${URL}?page=${pageNumber}&limit=${limit}&sort=${sort}&order=${order}${query}`;
        }
        return `${URL}?page=${pageNumber}&limit=${limit}${query}`;
    };

    return {
        data,
        meta: {
            pagination: {
                currentPage: page,
                nextPage: isNextPage ? `${paginationURL(page + 1)}` : null,
                previousPage: isPreviousPage
                    ? `${paginationURL(page - 1)}`
                    : null,
                totalPages: Math.ceil(totalItems / limit),
                limit,
            },
            totalItems,
        },
    };
};
