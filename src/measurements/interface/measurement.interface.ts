import * as express from 'express';
import { Address } from '../../common';
import {
  CreateMeasurementInput,
  FindMeasurementInput,
} from '../dto/create-measurement.input';
import { UpdateMeasurementInput } from '../dto/update-measurement.input';

export interface IMeasurement<T> {
  CreateMeasurement(
    createMeasurementInput: CreateMeasurementInput,
    req: express.Request,
  ): Promise<T>;
  GetMeasurement(
    findMeasurementInput: FindMeasurementInput,
    req: express.Request,
  ): Promise<T>;
  GetMeasurements(req: express.Request): Promise<T[]>;
  UpdateMeasurement(
    updateMeasurementInput: UpdateMeasurementInput,
    req: express.Request,
  ): Promise<T>;
  DeleteMeasurement(
    findMeasurementInput: FindMeasurementInput,
    req: express.Request,
  ): Promise<void>;
}

export interface Measurements {
  MeasurementUnit: Measurement;
  Trouser: {
    Length: number;
    WaistLength: number;
    TighLength: number;
    AnkleLength: number;
    PucketType?: PucketType;
    WaistTightType?: WaistTightType;
  };
  Shirt: {
    Length: number;
    ShoulderLength: number;
    ArmLength: number;
    ArmWidth: number;
    NeckLength: number;
    ButtonType: ButtonType;
    PucketType?: PucketType;
    DesignType?: DesignType;
    ColarNeckType?: ColarNeckType;
    LinkType?: LinkType;
  };
  Cap?: {
    Length: number;
    Height: number;
    DesignType?: DesignType;
  };
  Agbada?: {
    Length: number;
    Width: number;
    DesignType?: DesignType;
  };
}

export type MeasurementCategories = {
  [Property in keyof MeasurementClass]: Array<Measurements>;
};

export type MeasurementClass = {
  [MeasurementType.SELF]: string;
};

export enum MeasurementTypes {
  KAFTAN = 'KAFTAN',
  COMPLETE = 'COMPLETE',
  CASUAL_SHIRT = 'CASUAL_SHIRT',
  KAFTAN_SENATOR = 'KAFTAN_SENATOR',
  PALM_TROUSER = 'PALM_TROUSER',
  SUITES = 'SUITES',
}

export enum ButtonType {
  EMBEDDED = 'EMBEDDED',
  EXPOSED = 'EXPOSED',
}

export enum WaistTightType {
  ROPE = 'ROPE',
  BUTTON = 'BUTTON',
}

export enum DesignType {
  PLAIN = 'PLAIN',
  DESIGN = 'DESIGN',
}

export enum PucketType {
  INSIDE = 'INSIDE',
  OUTSIDE = 'OUTSIDE',
}

export enum LinkType {
  CUFFLINKS = 'CUFFLINKS',
  BUTTON = 'BUTTON',
}

export enum ColarNeckType {
  EMBEDDED = 'EMBEDDED',
  BUTTON = 'BUTTON',
}

export enum CapType {
  GOBI = 'GOBI',
  ABETI = 'ABETI',
}

export enum Measurement {
  cm = 'cm',
  m = 'm',
  inch = 'inch',
}

export enum MeasurementType {
  SELF = 'SELF',
  FATHER = 'FATHER',
  SON = 'SON',
  BROTHER = 'BROTHER',
  UNCLE = 'UNCLE',
  GRANDFATHER = 'GRANDFATHER',
}

export enum DeliveryTimeLine {
  SEVENDAYS = 'SEVENDAYS',
  TENDAYS = 'TENDAYS',
  FIFTEENDAYS = 'FIFTEENDAYS',
  TWENTYDAYS = 'TWENTYDAYS',
  TWOWEEKS = 'TWOWEEKS',
  THREEWEEKS = 'THREEWEEKS',
  FOURWEEKS = 'FOURWEEKS',
  FIVEWEEKS = 'FIVEWEEKS',
  SIXWEEKS = 'SIXWEEKS',
  SEVENWEEKS = 'SEVENWEEKS',
}

export enum RequestActions {
  ClothToSow = 'ClothToSow',
  ClothToReturn = 'ClothToReturn',
  ClothToComplain = 'ClothToComplain',
  ClothToReview = 'ClothToReview',
}

export interface Cloths {
  ClothToSow: {
    [MeasurementType.SELF]: {
      PickUpAddress: Address;
    };
  };
}
