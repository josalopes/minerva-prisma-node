export interface QaFile {
  path: string
  name: string
  extension: string
  directory: string
  content: string
}
export interface QaContext {
  files: QaFile[]
}
