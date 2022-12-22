import styled from "styled-components";
import { LayerGroup } from "~/components/Icons/LayerGroup";
import { Clock } from "~/components/Icons/Clock";
import { Coins } from "~/components/Icons/Coins";
import { ButtonPrimary } from "~/components/Button";
import Image from "next/image";
import { numberWithCommas } from "~/utils";
import plus from "~/assets/icons/Plus.svg";
import Column from "../Column";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useRef,
} from "react";
import useBuildDefenceStart, {
    DefenceType,
} from "~/hooks/calls/useBuildDefenceStart";
import useBuildDefenceComplete from "~/hooks/calls/useBuildDefenceComplete";
import NumericInput from "react-numeric-input";
import { Target } from "react-feather";

const Box = styled.div<{ customColor: string }>`
    width: 100%;
    max-height: 70px;
    display: flex;
    flex-direction: row;
    //align-items: center;
    //justify-content: space-between;
    margin-bottom: 10px;
    //padding: 10px;
    border: 2px solid ${(props) => props.customColor};
    background-color: #151a1e;
    border-radius: 4px;
    overflow: hidden;
`;

const SubBox = styled.div`
    width: 100%;
    //max-height: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
`;

const Title = styled.div`
    width: 130px;
`;

const InfoContainer = styled.div`
    //width: 600px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 50%;
`;
const ResourceContainer = styled(Column)`
    width: 50px;
    text-align: left;
    gap: 3px;
`;

const NumberContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 4px;
    align-items: center;
    font-size: 14px;
    line-height: 18.2px;
`;

const ResourceTitle = styled.div`
    color: grey;
    font-weight: 700;
    font-size: 12px;
    @media (max-width: 1300px) {
        display: none;
    }
`;

const ImageContainer = styled.div`
    width: 70px;
`;

const ButtonContainer = styled.div`
    max-width: 300px;
    min-width: 195px;

    @media (min-width: 1000px) {
        width: 300px;
    }
`;

interface Props {
    img: any;
    title: string;
    functionCallName: DefenceType;
    level?: number;
    time?: number;
    costUpdate?: { metal: number; crystal: number; deuterium: number };
    hasEnoughResources?: boolean;
    isUpgrading?: boolean;
}

type ButtonState = "valid" | "noResource" | "updated" | "upgrading";

interface ButtonArrayStates {
    state: ButtonState;
    title: string;
    callback?: () => void;
    color?: string;
    icon: React.ReactNode;
}

const DefencesBox = ({
    img,
    title,
    level,
    hasEnoughResources,
    costUpdate,
    functionCallName,
    time,
    isUpgrading,
}: Props) => {
    const [quantity, setQuantity] = useState(0);
    const upgrade = useBuildDefenceStart(functionCallName, quantity);
    const complete = useBuildDefenceComplete(functionCallName);
    const onChangeHandler = (e) => {
        setQuantity(e.target.value);
    };

    const metal = costUpdate ? numberWithCommas(costUpdate.metal) : null;
    const crystal = costUpdate ? numberWithCommas(costUpdate.crystal) : null;
    const deuterium = costUpdate
        ? numberWithCommas(costUpdate.deuterium)
        : null;
    // const collectResources = useCollectResources()
    const buttonState = useMemo((): ButtonState => {
        if (time !== undefined && time > 0) {
            return "upgrading";
        } else if (time !== undefined && time === 0) {
            return "updated";
        }
        if (!hasEnoughResources) {
            return "noResource";
        }

        return "valid";
    }, [hasEnoughResources, time]);

    const statesButton: ButtonArrayStates[] = [
        {
            state: "valid",
            title: "Upgrade",
            callback: upgrade,
            color: "#6cbd6a",
            icon: <Image src={plus} alt="plus" />,
        },
        {
            state: "upgrading",
            title: "In Progress",
            // callback: () => void,
            color: "yellow",
            icon: <Image src={plus} alt="plus" />,
        },
        {
            state: "updated",
            title: "Complete Upgrade",
            callback: complete,
            color: "#0DACF0",
            icon: <Image src={plus} alt="plus" />,
        },
        {
            state: "noResource",
            title: "Need Resources",
            // callback: () => {},
            color: "#402F2C",
            icon: <Image src={plus} alt="plus" />,
        },
    ];

    const actualButtonState = statesButton.find(
        (state) => state.state === buttonState
    );
    const isDisabled =
        isUpgrading ||
        actualButtonState?.state === "noResource" ||
        actualButtonState?.state === "upgrading";

    return (
        <Box customColor={actualButtonState?.color ?? "grey"}>
            <ImageContainer>
                <Image src={img} alt={title} />
            </ImageContainer>
            <SubBox>
                <Title>{title}</Title>
                <InfoContainer>
                    <ResourceContainer>
                        <ResourceTitle>UNITS AVAILABLE</ResourceTitle>
                        <NumberContainer>
                            <LayerGroup />
                            {level}
                        </NumberContainer>
                    </ResourceContainer>
                    <ResourceContainer>
                        <ResourceTitle>TIME END</ResourceTitle>
                        <NumberContainer>
                            <Clock />
                            {time !== undefined ? `${time}m` : "-"}
                        </NumberContainer>
                    </ResourceContainer>
                    <ResourceContainer>
                        <ResourceTitle>METAL COST</ResourceTitle>
                        <NumberContainer>
                            <Coins />
                            {metal}
                        </NumberContainer>
                    </ResourceContainer>
                    <ResourceContainer>
                        <ResourceTitle>CRYSTAL COST</ResourceTitle>
                        <NumberContainer>
                            <Coins />
                            {crystal}
                        </NumberContainer>
                    </ResourceContainer>
                    <ResourceContainer>
                        <ResourceTitle>DEUTERIUM COST</ResourceTitle>
                        <NumberContainer>
                            <Coins />
                            {deuterium}
                        </NumberContainer>
                    </ResourceContainer>
                    <input
                        type="text"
                        value={quantity}
                        onChange={onChangeHandler}
                        size={4}
                    />
                </InfoContainer>
                <ButtonContainer>
                    <ButtonPrimary
                        customColor={
                            isDisabled ? undefined : actualButtonState?.color
                        }
                        onClick={() =>
                            actualButtonState?.callback &&
                            actualButtonState.callback()
                        }
                        disabled={isDisabled}
                    >
                        <div
                            style={{
                                display: "flex",
                                flex: 1,
                                justifyContent: "center",
                                flexDirection: "row",
                            }}
                        >
                            <div style={{ width: 20, height: 20 }}>
                                {actualButtonState?.icon}
                            </div>
                            {actualButtonState?.title}
                        </div>
                    </ButtonPrimary>
                </ButtonContainer>
            </SubBox>
        </Box>
    );
};

export default DefencesBox;