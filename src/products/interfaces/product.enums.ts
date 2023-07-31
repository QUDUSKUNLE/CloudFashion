import * as express from 'express';
import {
  CreateProductInput,
  FindProductInput,
  DesignerFetchCustomersProducts,
  DesignerFetchCustomerProducts,
  DesignerFetchCustomerProduct,
  CustomerFetchProducts,
  CustomerFetchProduct,
} from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { FetchArguments } from '../../common';

export enum ProductEnum {
  Kaftan = 'Kaftan',
  Complete = 'Complete',
  CasualShirt = 'CasualShirt',
  KaftanSenator = 'KaftanSenator',
  PalmTrouser = 'PalmTrouser',
}

export enum SizeEnum {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}

export enum UnitEnum {
  Kg = 'Kg',
  Litre = 'Litre',
  Piece = 'Piece',
}

export interface IProductAdminService<T> {
  FindOne(findProductInput: FindProductInput, req: express.Request): Promise<T>;
  FindAll(fetchArgs: FetchArguments): Promise<T[]>;
  Remove(ProductID: string, req: express.Request): Promise<void>;
}

export interface IProductService<T> {
  CreateProduct(
    createProductInput: CreateProductInput,
    req: express.Request,
  ): Promise<T>;
  DesignerFetchCustomersProducts(
    designerFetchCustomersProducts: DesignerFetchCustomersProducts,
    req: express.Request,
  ): Promise<T[]>;
  DesignerFetchCustomerProducts(
    designerFetchCustomerProducts: DesignerFetchCustomerProducts,
    req: express.Request,
  ): Promise<T[]>;
  DesignerFetchCustomerProduct(
    designerFetchCustomerProduct: DesignerFetchCustomerProduct,
    req: express.Request,
  ): Promise<T>;
  CustomerFetchProducts(
    customerFetchProducts: CustomerFetchProducts,
  ): Promise<T[]>;
  CustomerFetchProduct(customerFetchProduct: CustomerFetchProduct): Promise<T>;
  DesignerUpdateProduct(
    updateProductInput: UpdateProductInput,
    req: express.Request,
  ): Promise<T>;
}

export interface ICasheService<T> {
  get(key: string): Promise<T>;
  set(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
}
