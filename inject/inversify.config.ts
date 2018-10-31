import { IDeckService } from './../services/DeckService/IDeckService';
import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from './TYPES';
import { DeckService } from "../services/DeckService/DeckService";

const container = new Container();
container.bind<IDeckService>(TYPES.IDeckService).to(DeckService);

export default container;
