import { ErrorWithCode } from '../../services/errors/errors'

export class LinkError extends ErrorWithCode {
  link?: string

  constructor(detailCode?: string, link?: string) {
    super('LINK_ERROR')
    this.detailCode = detailCode
    this.link = link
  }
}

export class MailToError extends LinkError {
  mail: string
  constructor(mail: string) {
    super('MAILTO_ERROR')
    this.mail = mail
  }
}
