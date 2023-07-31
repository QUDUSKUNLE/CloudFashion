export interface IMeasurement<T> {
  CreateMeasurement(data: unknown): Promise<T>;
  GetMeasurement(MeasurementID: string): Promise<T>;
  GetMeasruements(): Promise<T[]>;
  UpdateMeasurement(MeasurementID: string, data: unknown): Promise<T>;
  DeleteMeasurement(MeasurementID: string): Promise<void>;
}
