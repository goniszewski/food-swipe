import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item, ItemDocument } from './entities/item.schema';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  async create(createItemDto: CreateItemDto) {
    // return new this.itemModel(createItemDto).save();
    return this.itemModel
      .findOneAndUpdate(
        { name: createItemDto.name },
        { $setOnInsert: createItemDto },
        { upsert: true, new: true },
      )
      .exec();
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find({}).exec();
  }

  async findById(id: string): Promise<Item> {
    return this.itemModel.findById(id).exec();
  }

  async findByName(name: string) {
    return this.itemModel.findOne({ name }).exec();
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    return this.itemModel.findByIdAndUpdate(id, updateItemDto).exec();
  }

  async remove(id: string) {
    return this.itemModel.findByIdAndRemove(id).exec();
  }
}
