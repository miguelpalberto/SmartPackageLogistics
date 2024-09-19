import defaultImage from "~/assets/images/no_image_available.png";

export const timeStampToLocaleString = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: undefined })
}

export const toPackageDescription = (packageType, product) => {
    switch (packageType.toLowerCase()) {
        case "primary":
            return `${product.primaryPackageType} with ${product.primaryPackQuantity} ${product.primaryPackageMeasurementUnit} of ${product.name} (ref#${product.reference})`
        case "secondary":
            return `Box with ${product.secondaryPackQuantity} ${product.primaryPackageType}s of ${product.name} (ref#${product.reference})`
        case "tertiary":
            return `Pallet with ${product.tertiaryPackQuantity} Boxes of ${product.name} (ref#${product.reference})`
    }
}

export const getProductImgSrc = (product) => {
    return product.imageUrl !== undefined && product.imageUrl?.trim().length !== 0 ? product.imageUrl : defaultImage;
}

export const currentStock = (packageType, product) => {
    switch (packageType.toLowerCase()) {
        case "primary":
            return product.unitStock
        case "secondary":
            return product.boxStock
        case "tertiary":
            return product.containerStock
    }
}
