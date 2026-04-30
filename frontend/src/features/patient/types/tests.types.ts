export type TestTab = 'lab' | 'images';
export type TestFileType = 'lab' | 'image';

export interface TestResult {
  id: string;
  fileName: string;
  fileType: TestFileType;
  orderedBy: string;
  date: string;
}
