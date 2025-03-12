export const priceAfterDiscount = (price,discount=1)=>{
    const discountAmount= Math.ceil(Number(discount)*Number(price)/100);
    return Number(price)-Number(discountAmount);
}