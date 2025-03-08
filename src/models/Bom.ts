export interface CreateBOM {
    id?: number;

    title: string;

    requesterName: string;

    requesterEmail: string;

    requesterTel: string;

    requesterAddress: string;

    requesterWebsite: string;

    receiverName: string;

    receiverEmail: string;

    receiverTel: string;

    receiverAddress: string;

    receiverWebsite: string;

    materialQuotations: MaterialQuotationRequest[];
}

export interface MaterialQuotationRequest {
    code: string;

    description: string;

    unit: string;

    quantity: string;

    deliveryDate: string;

    price: string;

    tax: string;

    priceNoTax: string;

    priceTax: string;

    totalPrice: string;

    isSaved: boolean;
}


export interface SearchQuotationRequest {
    title: string;

    requesterName: string;

    receiverName: string;

    startDate: string;

    endDate: string;
}


export interface QuotationResponse {
    id: number;

    title: string;

    requesterName: string;

    requesterEmail: string;

    requesterTel: string;

    requesterAddress: string;

    requesterWebsite: string;

    receiverName: string;

    receiverEmail: string;

    receiverTel: string;

    receiverAddress: string;

    receiverWebsite: string;

    createdAt: string;

    materialQuotations: MaterialQuotationResponse[];
}

export interface MaterialQuotationResponse {
    id: number;

    quotationRequest: string;

    code: string;

    description: string;

    unit: string;

    quantity: string;

    deliveryDate: string;

    price: string;

    tax: string;

    priceNoTax: string;

    priceTax: string;

    totalPrice: string;
}