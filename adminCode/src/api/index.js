import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/user',
        method: 'get',
        params: query
    });
};

export const delData = _id => {
    return request({
        url: '/user/deluser',
        method: 'post',
        data: _id
    });
};
export const updateData = params => {
    return request({
        url: '/user/detail',
        method: 'post',
        data: params
    });
};


export const getart = query => {
    return request({
        url: '/article/all',
        method: 'get',
        params: query
    });
};

export const delart = _id => {
    return request({
        url: '/article/delart',
        method: 'post',
        data: _id
    });
};

export const gettoken = () => {
    return request({
        url: '/article/upload',
        method: 'get'
    });
};

export const getcom = query => {
    return request({
        url: '/article/getcom',
        method: 'get',
        params: query
    });
};

export const delcom = _id => {
    return request({
        url: '/article/delcom',
        method: 'post',
        data: _id
    });
};

export const delreply = params => {
    return request({
        url: '/article/delreply',
        method: 'post',
        data: params
    });
};