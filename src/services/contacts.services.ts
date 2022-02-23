import { IncomingHttpHeaders } from 'http';
import { IResult, IReturnError, IReturnResult } from '../Interface/return.interface';
import { IContacts, IContactsBody } from '../Interface/contacts.interface';
import { contactsRepository } from '../repository/contacts.repository';
import { decodeToken } from './jwt';
import { ConfigurationService } from '../configurations/controller.config';
import { userRepository } from '../repository/user.repository';

export class ContactsServices {
  async create(value: IContactsBody, headers: IncomingHttpHeaders): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: user, error: decodeError } = decodeToken(headers.token as string, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));

    if (decodeError) return { error: { data: 'Token Error', status: 401 } };

    const { result: contactUser, error: DBError } = await userRepository.getUserByEmail(value.user_email);

    if (DBError) return { error: { data: 'DB Error', status: 401 } };

    const { result, error } = await contactsRepository.createByBothEntity(user, contactUser);

    if (error) return { error: { data: error.message, status: 500 } };

    return { result: { data: result, status: 201 } };
  }
}

export const contactsServices = new ContactsServices();
