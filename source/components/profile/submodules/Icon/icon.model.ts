// Utils
import { getLocale, languages } from '~/lang';
import { Result, utils } from '~/utils';

// API
import { database } from '~/api/database';
import { storage } from '~/api/storage';

// Animations
import { IconStatus } from '~/animations/profile.animations';

export interface ViewContext {
  Warning	: string,
  Loading	: IconStatus,
  NewIcon	: string,
}

const ERROR_MESSAGES = {
  UNREACHABLE : 'a',
  EMPTY       : 'a',
  UPDATE      : 'a',
} as const;

const SIZE_LIMIT = 15e5;

export class Model {

  private view: ViewContext;

  private uid: string = String();
  private lang: languages = languages.Russian;

  constructor(context_reference: ViewContext) {
    this.view = context_reference;
  }

  public async getDefaultIcons(): Promise<Array<string>> {

    const resultPaths = Array<string>();
    const responseResult = await storage.list('UserIconse');

    if ( responseResult instanceof Error ) {

      this.IOError(`Image server not response: ${ responseResult.message }`);

      return resultPaths;

    }

    if ( responseResult.files.length ) {

      this.IOError('Простите, но судя по всему изображения по умолчанию нет, или они на пересмотре');

      return resultPaths;
      
    }

    const result = await Promise.all(responseResult.files.map(x => {
      return storage.reference(x.path);
    }));

    result.forEach(x => {
      if ( typeof x === 'string' ) resultPaths.push(x);
    });

    queueMicrotask(() => {
      if ( result.some(x => x instanceof Error) ) {
        this.IOError('Some default images can\'t be dowloaded');
      }
    });

    return resultPaths;

  }

  public async uploadIcon(event: Event) {

    const { files, value } = event.target as HTMLInputElement;

    const fileResult = Model.validateInput(files);

    if ( fileResult instanceof Error ) return this.IOError(fileResult.message);

    const validationResult = this.validateFile(fileResult, value);

    if ( validationResult instanceof Error ) return this.IOError(validationResult.message);

    await this.setIcon(validationResult, fileResult);

    this.view.Loading = IconStatus.done;
    this.view.Warning = String();

  }

  private validateFile(file: File, name: string): Result<string> {

    this.view.Loading = IconStatus.start;
    this.view.NewIcon = String();

    const extensionResult = utils.extension.define(name, ['png', 'jpg', 'webp']);

    if ( extensionResult instanceof Error ) return extensionResult;

    const FILE = new File([ file ], this.uid);
    const DIST = `UserIcons/ID/${ FILE.name }::${ FILE.size.toString(36).toUpperCase() }.${ extensionResult }`;

    if ( FILE.size >= SIZE_LIMIT ) {

      const curentSize = parseFloat(Number(FILE.size / 10e5).toPrecision(3));
      const errorMessage = getLocale(this.lang).fileInput.sizeStrict;

      return Error(`${ errorMessage }: ${ curentSize }МБ`);

    }

    return DIST;

  }

  private static validateInput(fileInput: FileList | null): Result<File> {

    if ( !fileInput || !fileInput.length ) return Error(ERROR_MESSAGES.EMPTY);

    return fileInput[0];

  }

  private IOError(message: string) {
    this.view.Warning = message;
    this.view.Loading = IconStatus.error;
  }

  private async setIcon(path: string, file: File) {

    this.view.Loading = IconStatus.pending;

    await storage.upload(path, file, { contentType: file.type });

    const newReference = await storage.reference(path);

    if ( newReference instanceof Error ) return this.IOError(newReference.message);

    this.view.NewIcon = newReference;

  }

  public async updateIcon(uid: string, path: string) {

    const updateResult = await database.update(`users/${ uid }/state`, { image: path });

    if ( updateResult instanceof Error ) this.IOError(ERROR_MESSAGES.UPDATE);

  }

}