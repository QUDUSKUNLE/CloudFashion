import GraphQLJSON from 'graphql-type-json';
import { Document, Schema as Sch } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { CreateClothingInput } from 'src/services/clothing/dto/create-clothing.input';
import { MeasurementCategories } from '../interface/interface';

export type MeasurementDocument = Measurement & Document;
export type ClothingDocument = Clothing & Document;

@Schema()
@ObjectType()
export class Measurement {
  @Field(() => String, { description: 'Measurement identity' })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'Measurement Identity.',
  })
  MeasurementID: string;

  @Prop({ type: String })
  UserID: string;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Cloth measurement.',
  })
  @Prop({ type: Sch.Types.Mixed, required: true })
  Measurement: MeasurementCategories;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Measurement CreatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Measurement UpdatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  UpdatedAt: Date;
}

@Schema()
@ObjectType()
export class Clothing {
  @Field(() => String, { description: 'Cloth Identity' })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'Cloth Identity.',
  })
  ClothID: string;

  @Field(() => String, { nullable: true, description: 'Measurement Identity.' })
  @Prop({ type: String, required: false })
  MeasurementID: string;

  @Prop({ type: String })
  UserID: string;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Cloth Request Data',
  })
  @Prop({ type: Sch.Types.Mixed })
  ClothRequestPayload: CreateClothingInput;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Clothing CreatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Clothing UpdatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  UpdatedAt: Date;
}

@ObjectType()
export class ClothsPayload {
  @Field(() => String, { description: 'Cloth Identity' })
  ClothID: string;

  @Field(() => Measurement, {
    nullable: true,
    description: 'Measurement Identity.',
  })
  MeasurementPayload: Measurement;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Cloth Request Data',
  })
  ClothRequestPayload: CreateClothingInput;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Clothing CreatedAt.',
  })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Clothing UpdatedAt.',
  })
  UpdatedAt: Date;
}

export const MeasurementSchema = SchemaFactory.createForClass(Measurement);
export const ClothingSchema = SchemaFactory.createForClass(Clothing);
