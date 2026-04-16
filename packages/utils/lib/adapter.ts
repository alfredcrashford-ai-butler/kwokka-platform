import { PublicProps } from './public-props';

export abstract class Adapter<Model, ModelDTO = PublicProps<Model>> {
  public abstract deserialize(dto: ModelDTO): Model;

  public deserializeList(dtoList: ModelDTO[]): Model[] {
    return (dtoList || []).map((el) => this.deserialize(el));
  }

  public abstract serialize(model: Partial<Model>): ModelDTO;

  public serializeList(modelList: Model[]): ModelDTO[] {
    return (modelList || []).map((el) => this.serialize(el));
  }
}
