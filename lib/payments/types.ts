/**
 * Developed by SaaSolutions SL
 * Intellectual Property owned by Paradox FZCO
 * © 2026 Paradox FZCO. All rights reserved.
 */
export type PaymentProviderName = 'stripe'|'coinbase'|'circle'|'bank_transfer';
export interface CheckoutInput { userId:string; planId?:string; amount:number; currency:string; metadata?:Record<string,string> }
export interface PaymentResult { ok:boolean; provider:PaymentProviderName; checkoutUrl?:string; reference?:string; error?:string }
export interface PaymentProvider { createCheckout(input:CheckoutInput):Promise<PaymentResult>; createCustomerPortal(customerId:string):Promise<PaymentResult> }
