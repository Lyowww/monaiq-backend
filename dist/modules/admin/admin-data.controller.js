"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDataController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_guard_1 = require("../../common/guards/admin.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const admin_data_service_1 = require("./admin-data.service");
let AdminDataController = class AdminDataController {
    adminData;
    constructor(adminData) {
        this.adminData = adminData;
    }
    listCollections() {
        return this.adminData.listCollectionMeta();
    }
    list(collection, page = '1', pageSize = '50') {
        const p = Number(page) || 1;
        const ps = Number(pageSize) || 50;
        return this.adminData.listDocuments(collection, { page: p, pageSize: ps });
    }
    getOne(collection, id) {
        return this.adminData.getDocument(collection, id);
    }
    create(collection, body) {
        return this.adminData.createDocument(collection, body ?? {});
    }
    patch(collection, id, body) {
        return this.adminData.patchDocument(collection, id, body ?? {});
    }
    remove(collection, id) {
        return this.adminData.deleteDocument(collection, id);
    }
};
exports.AdminDataController = AdminDataController;
__decorate([
    (0, common_1.Get)('collections'),
    (0, swagger_1.ApiOperation)({ summary: 'List Mongo collections available for admin CRUD' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminDataController.prototype, "listCollections", null);
__decorate([
    (0, common_1.Get)(':collection'),
    (0, swagger_1.ApiOperation)({ summary: 'Paginated documents for a collection' }),
    __param(0, (0, common_1.Param)('collection')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminDataController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':collection/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Single document by id' }),
    __param(0, (0, common_1.Param)('collection')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminDataController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(':collection'),
    (0, swagger_1.ApiOperation)({ summary: 'Create document (fields must match schema)' }),
    __param(0, (0, common_1.Param)('collection')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminDataController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':collection/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Partial update ($set only, schema-known fields)' }),
    __param(0, (0, common_1.Param)('collection')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AdminDataController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)(':collection/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete document' }),
    __param(0, (0, common_1.Param)('collection')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminDataController.prototype, "remove", null);
exports.AdminDataController = AdminDataController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('admin/db'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [admin_data_service_1.AdminDataService])
], AdminDataController);
//# sourceMappingURL=admin-data.controller.js.map