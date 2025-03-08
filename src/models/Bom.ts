export interface CreateBOM {
    id?: number;

    requesterName?: string;

    requesterEmail?: string;

    requesterTel?: string;

    requesterAddress?: string;

    requesterWebsite?: string;

    receiverName?: string;

    receiverEmail?: string;

    receiverTel?: string;

    receiverAddress?: string;

    receiverWebsite?: string;

    materialQuotations: MaterialQuotationRequest[];
}

export interface MaterialQuotationRequest {
    code?: string;

    description?: string;

    unit?: string;

    quantity?: string;

    deliveryDate?: string;

    price?: string;

    tax?: string;

    priceNoTax?: string;

    priceTax?: string;

    totalPrice?: string;

    isSaved: boolean;
}


export interface SearchQuotationRequest {
    requesterName?: string;

    receiverName?: string;

    startDate?: string;

    endDate?: string;
}


export interface QuotationResponse {
    id?: string;

    requesterName?: string;

    requesterEmail?: string;

    requesterTel?: string;

    requesterAddress?: string;

    requesterWebsite?: string;

    receiverName?: string;

    receiverEmail?: string;

    receiverTel?: string;

    receiverAddress?: string;

    receiverWebsite?: string;

    materialQuotations: MaterialQuotationResponse[];
}

export interface MaterialQuotationResponse {
    id?: string;

    quotationRequest?: string;

    code?: string;

    description?: string;

    unit?: string;

    quantity?: string;

    deliveryDate?: string;

    price?: string;

    tax?: string;

    priceNoTax?: string;

    priceTax?: string;

    totalPrice?: string;
}