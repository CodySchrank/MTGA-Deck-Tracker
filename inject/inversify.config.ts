//@ts-ignore
import "reflect-metadata";



import { UserService } from './../services/UserService/UserService';
import { IUserService } from './../services/UserService/IUserService';
import { BasicService } from './../services/BasicService/BasicService';
import { IBasicService } from './../services/BasicService/IBasicService';
import { LogReader } from './../services/LogReader/LogReader';
import { ILogReader } from './../services/LogReader/ILogReader';
import { IDeckService } from './../services/DeckService/IDeckService';
import { Container } from "inversify";
import { TYPES } from './TYPES';
import { DeckService } from "../services/DeckService/DeckService";

const container = new Container();
container.bind<IDeckService>(TYPES.IDeckService).to(DeckService);
container.bind<ILogReader>(TYPES.ILogReader).to(LogReader);
container.bind<IBasicService>(TYPES.IBasicService).to(BasicService);
container.bind<IUserService>(TYPES.IUserService).to(UserService);

export default container;
