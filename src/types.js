// @flow

export type BuildOpts = {
  baseUrl?: string,
  cwd: string
}

export type BuildConfig = {
  input: string,
  output: string
}

export type BuildEntry = {
  type: string,
  input: {
    basePath: string,
    dirPath: string,
    path: string
  },
  output: {
    basePath: string,
    dirPath: string,
    path: string
  },
  baseUrl?: string
}

export type BuildResult = {
  type: string,
  input: {
    basePath: string,
    // dirPath: string,
    path: string
  },
  output: {
    basePath: string,
    // dirPath: string,
    path: string
  }
}

export type BuildAllFn = (
  config: BuildEntry | BuildEntry[]
) => Promise<BuildResult[]>
