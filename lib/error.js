
export default class ModelError extends Error {
  constructor(message = '') {
    super(message);

    this.name = 'ModelError';
  }
}

