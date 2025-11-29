/**
 * Types para entidades do Dynamics 365
 */

export interface Contact {
  contactid: string
  fullname: string
  firstname?: string
  lastname?: string
  emailaddress1?: string
  telephone1?: string
  mobilephone?: string
  address1_line1?: string
  address1_city?: string
  address1_stateorprovince?: string
  address1_postalcode?: string
  createdon?: string
  modifiedon?: string
}

export interface Account {
  accountid: string
  name: string
  emailaddress1?: string
  telephone1?: string
  websiteurl?: string
  address1_line1?: string
  address1_city?: string
}

export interface PhoneCall {
  activityid: string
  subject: string
  description?: string
  phonenumber?: string
  directioncode?: boolean // true = outgoing, false = incoming
  actualdurationminutes?: number
  regardingobjectid?: string
  statuscode?: number
  createdon?: string
}

export interface DynamicsResponse<T> {
  '@odata.context': string
  value: T[]
  '@odata.count'?: number
}
