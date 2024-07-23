import { Message } from 'ai';
import { v4 as uuidv4 } from 'uuid';

export default (message: { content: string; id?: string }): Message => {
  return {
    content: message.content,
    id: message.id || uuidv4(),
    role: `user`,
  };
};
