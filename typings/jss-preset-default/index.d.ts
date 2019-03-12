declare module 'jss-preset-default' {
  import { JSSOptions } from 'jss'

  interface Options {
    template: object
    global: object
    extend: object
    nested: object
    compose: object
    camelCase: object
    defaultUnit: object
    expand: object
    vendorPrefixer: object
    propsSort: object
  }

  export default function preset(options?: Options): JSSOptions
}
