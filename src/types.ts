export type MemberStatus = 'Active' | 'OnLeave' | 'Alumni'

export interface Member {
  id: string
  name: string
  office: string
  status: MemberStatus
}
