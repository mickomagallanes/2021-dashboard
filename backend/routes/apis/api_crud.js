"use strict";

function ApiCRUD(router, routeName, service) {

    router.get(`/${routeName}/get/all`, function (req, res, next) {
        service.getAll(res);
    });

    router.get(`/${routeName}/get/:id`, function (req, res, next) {
        service.getById(res, req.params.id);
    });

    router.delete(`/${routeName}/delete/:id`, function (req, res, next) {
        service.deleteById(res, req.params.id);
    });

    router.put(`/${routeName}/modify/:id`, function (req, res, next) {
        service.update(res, req.params.id, req.body);
    });

    router.post(`/${routeName}/add`, function (req, res, next) {
        service.insert(res, req.body);
    });

}

module.exports = ApiCRUD;