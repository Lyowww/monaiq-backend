import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminDataService } from './admin-data.service';

@ApiTags('admin')
@ApiBearerAuth('bearer')
@Controller('admin/db')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminDataController {
  constructor(private readonly adminData: AdminDataService) {}

  @Get('collections')
  @ApiOperation({ summary: 'List Mongo collections available for admin CRUD' })
  listCollections() {
    return this.adminData.listCollectionMeta();
  }

  @Get(':collection')
  @ApiOperation({ summary: 'Paginated documents for a collection' })
  list(
    @Param('collection') collection: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '50'
  ) {
    const p = Number(page) || 1;
    const ps = Number(pageSize) || 50;
    return this.adminData.listDocuments(collection, { page: p, pageSize: ps });
  }

  @Get(':collection/:id')
  @ApiOperation({ summary: 'Single document by id' })
  getOne(@Param('collection') collection: string, @Param('id') id: string) {
    return this.adminData.getDocument(collection, id);
  }

  @Post(':collection')
  @ApiOperation({ summary: 'Create document (fields must match schema)' })
  create(@Param('collection') collection: string, @Body() body: Record<string, unknown>) {
    return this.adminData.createDocument(collection, body ?? {});
  }

  @Patch(':collection/:id')
  @ApiOperation({ summary: 'Partial update ($set only, schema-known fields)' })
  patch(
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>
  ) {
    return this.adminData.patchDocument(collection, id, body ?? {});
  }

  @Delete(':collection/:id')
  @ApiOperation({ summary: 'Delete document' })
  remove(@Param('collection') collection: string, @Param('id') id: string) {
    return this.adminData.deleteDocument(collection, id);
  }
}
