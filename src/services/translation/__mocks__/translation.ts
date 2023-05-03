import { useTranslation } from '../translation'

const translation: any = jest.createMockFromModule('i18next')
translation.t = (key: string) => key
translation.language = 'en'
translation.changeLanguage = () => new Promise(() => {})

exports.translation = () => {}
exports.useTranslation = useTranslation
