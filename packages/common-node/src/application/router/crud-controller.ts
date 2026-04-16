import { Request, Response } from 'express';
import { injectable, injectFromBase } from 'inversify';
import { Adapter } from '@kwokka/utils';
import { Entity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '../../usecase';
import { ApiResult } from './api-result';
import { Controller, EntityNotFoundControllerException, MethodNotImplementedControllerException } from './controller';
import { HttpStatus } from './http-status';

@injectable()
@injectFromBase()
export abstract class CrudController<T extends Entity> extends Controller {
  protected listUsecase?: Usecase<Promise<UsecaseListResult<T>>>;
  protected createUsecase?: Usecase<Promise<T>>;
  protected updateUsecase?: Usecase<Promise<T>>;
  protected deleteUsecase?: Usecase<Promise<T>>;
  protected getByIdUsecase?: Usecase<Promise<T>>;
  protected abstract get adapter(): Adapter<T>;

  public async list(req: Request): Promise<ApiResult<T[]>> {
    if (!this.listUsecase) {
      throw new MethodNotImplementedControllerException('list');
    }

    const offset = this.parseOffset(req);
    const limit = this.parseLimit(req);
    const usecaseResult = await this.listUsecase.perform(offset, limit);
    const data = this.adapter.serializeList(usecaseResult.payload);
    return { status: HttpStatus.Ok, data, metadata: usecaseResult.metadata };
  }

  public async create(req: Request): Promise<ApiResult<T>> {
    if (!this.createUsecase) {
      throw new MethodNotImplementedControllerException('create');
    }

    let entity = this.adapter.deserialize(req.body);
    entity = await this.createUsecase.perform(entity);
    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data: data as any };
  }

  public async patch(req: Request, res?: Response): Promise<ApiResult<T>> {
    if (!this.updateUsecase) {
      throw new MethodNotImplementedControllerException('patch');
    }

    const entity = await this.updateUsecase.perform(req.params.id, req.body);
    if (!entity) {
      throw new EntityNotFoundControllerException(`id: ${req.params.id}`);
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data: data as any };
  }

  public async delete(req: Request): Promise<ApiResult<T>> {
    if (!this.deleteUsecase) {
      throw new MethodNotImplementedControllerException('delete');
    }

    const entity = await this.deleteUsecase.perform(req.params.id);
    if (!entity) {
      throw new EntityNotFoundControllerException(`id: ${req.params.id}`);
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data: data as any };
  }

  public async getById(req: Request): Promise<ApiResult<T>> {
    if (!this.getByIdUsecase) {
      throw new MethodNotImplementedControllerException('getById');
    }

    const entity = await this.getByIdUsecase.perform(req.params.id);
    if (!entity) {
      throw new EntityNotFoundControllerException(`id: ${req.params.id}`);
    }

    const data = this.adapter.serialize(entity);
    return { status: HttpStatus.Ok, data: data as any };
  }
}
