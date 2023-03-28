import React from "react";

interface ButtonShowMapProps {
    showMap: boolean;
    setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ButtonShowMap = ({showMap, setShowMap}: ButtonShowMapProps): JSX.Element => {

    return (
        <>
            <div className="ml-4">
                <button
                    onClick={() => setShowMap(!showMap)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    {showMap ? 'Voir les résultats' : 'Voir sur la carte'}
                </button>
            </div>
        </>
    );
};

export default ButtonShowMap;
