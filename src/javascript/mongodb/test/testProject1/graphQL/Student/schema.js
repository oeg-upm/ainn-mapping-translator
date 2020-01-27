export const type = `
  
  type Student {
    _id: Int
    name: String
    email: String
    age: Int
    failer: Boolean
    location: Direction
    subjects: [Student]
  }

  type StudentQueryResults {
    Students: [Student]
    Meta: QueryResultsMetadata
  }

  type StudentSingleQueryResult {
    Student: Student
  }

  type StudentMutationResult {
    Student: Student
    success: Boolean
    Meta: MutationResultInfo
  }

  type StudentMutationResultMulti {
    Students: [Student]
    success: Boolean
    Meta: MutationResultInfo
  }

  type StudentBulkMutationResult {
    success: Boolean
    Meta: MutationResultInfo
  }

  input StudentInput {
    _id: Int
    name: String
    email: String
    age: Int
    failer: Boolean
    location: DirectionInput
    subjects: [StudentInput]
  }

  input StudentMutationInput {
    name: String
    email: String
    age: Int
    age_INC: Int
    age_DEC: Int
    failer: Boolean
    location: DirectionInput
    location_UPDATE: DirectionMutationInput
    subjects: [StudentInput]
    subjects_PUSH: StudentInput
    subjects_CONCAT: [StudentInput]
    subjects_UPDATE: StudentArrayMutationInput
    subjects_UPDATES: [StudentArrayMutationInput]
    subjects_PULL: StudentFilters
  }

  input StudentArrayMutationInput {
    index: Int
    Updates: StudentMutationInput
  }

  input StudentSort {
    _id: Int
    name: Int
    email: Int
    age: Int
    failer: Int
    location: Int
    subjects: Int
  }

  input StudentFilters {
    _id_lt: Int
    _id_lte: Int
    _id_gt: Int
    _id_gte: Int
    _id: Int
    _id_ne: Int
    _id_in: [Int]
    name_contains: String
    name_startsWith: String
    name_endsWith: String
    name_regex: String
    name: String
    name_ne: String
    name_in: [String]
    email_contains: String
    email_startsWith: String
    email_endsWith: String
    email_regex: String
    email: String
    email_ne: String
    email_in: [String]
    age_lt: Int
    age_lte: Int
    age_gt: Int
    age_gte: Int
    age: Int
    age_ne: Int
    age_in: [Int]
    failer: Boolean
    failer_ne: Boolean
    failer_in: [Boolean]
    location_count: Int
    location: DirectionFilters
    subjects_count: Int
    subjects: StudentFilters
    OR: [StudentFilters]
  }
  
`;
  
  
export const mutation = `

  createStudent (
    Student: StudentInput
  ): StudentMutationResult

  updateStudent (
    _id: Int,
    Updates: StudentMutationInput
  ): StudentMutationResult

  updateStudents (
    _ids: [String],
    Updates: StudentMutationInput
  ): StudentMutationResultMulti

  updateStudentsBulk (
    Match: StudentFilters,
    Updates: StudentMutationInput
  ): StudentBulkMutationResult

  deleteStudent (
    _id: String
  ): DeletionResultInfo

`;


export const query = `

  allStudents (
    _id_lt: Int,
    _id_lte: Int,
    _id_gt: Int,
    _id_gte: Int,
    _id: Int,
    _id_ne: Int,
    _id_in: [Int],
    name_contains: String,
    name_startsWith: String,
    name_endsWith: String,
    name_regex: String,
    name: String,
    name_ne: String,
    name_in: [String],
    email_contains: String,
    email_startsWith: String,
    email_endsWith: String,
    email_regex: String,
    email: String,
    email_ne: String,
    email_in: [String],
    age_lt: Int,
    age_lte: Int,
    age_gt: Int,
    age_gte: Int,
    age: Int,
    age_ne: Int,
    age_in: [Int],
    failer: Boolean,
    failer_ne: Boolean,
    failer_in: [Boolean],
    location_count: Int,
    location: DirectionFilters,
    subjects_count: Int,
    subjects: StudentFilters,
    OR: [StudentFilters],
    SORT: StudentSort,
    SORTS: [StudentSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): StudentQueryResults

  getStudent (
    _id: String
  ): StudentSingleQueryResult

`;
  
