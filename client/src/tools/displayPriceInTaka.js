export const displayPriceInTaka =(price)=>{
    return new Intl.NumberFormat(
        'bn-BD',
        { style: 'currency', currency: 'BDT' }
    ).format(price)
}



// export const displayPriceInTaka = (price) => {
//     return `৳${new Intl.NumberFormat('en-US').format(price)}`;
// };
