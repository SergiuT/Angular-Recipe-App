export class UserModel {
  constructor(
    public email: string,
    public id: string,
    private tokenId: string,
    private _tokenExp: Date
  ) {}

  get token() {
    if (!this._tokenExp || new Date() > this._tokenExp) {
      return null;
    }
    return this.tokenId;
  }
}
