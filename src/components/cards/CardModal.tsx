import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import CardHeader from "./CardHeader";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import CardDescription from "./CardDescription";
import CardActions from "./CardActions";
import { User } from "@/types";
import { addCardMember } from "@/app/actions/card";
import { labels } from "@/constants/labels";
import CardCommentsInput from "./CardCommentsInput";
import { useParams } from "next/navigation";
import CardDate from "./CardDate";
import { Skeleton } from "@/components/ui/skeleton";
import CardTodo from "./CardTodo";
import CardLinks from "./CardLinks";

interface CardModel {
  id: string;
  isModal: boolean;
  setIsModal: (isModal: boolean) => void;
}
const CardModal = ({ id, isModal, setIsModal }: CardModel) => {
  const { data: cardDetails } = useSWR(`/api/card/${id}`, fetcher);
  const { boardId }: { boardId: string } = useParams();

  const getColor = (id: string) => {
    const foundLabel = labels.find((label) => label.id === id);
    return foundLabel?.color;
  };

  const [cardData, setCardData] = useState(cardDetails);

  useEffect(() => {
    setCardData(cardDetails);
  }, [cardDetails]);

  const removeCardMember = async (user: User) => {
    const cardIndex: any = user?.cardIds?.indexOf(cardData?.id);
    if (cardIndex > -1) {
      user?.cardIds?.splice(cardIndex, 1);
    }
    const userIndex: any = cardData?.userIds?.indexOf(user?.id);
    if (userIndex > -1) {
      cardData?.userIds?.splice(userIndex, 1);
    }

    await addCardMember({ user, card: cardData });
    setCardData(cardData);
  };

  return (
    <Dialog open={isModal} onOpenChange={() => setIsModal(false)}>
      <DialogContent>
        <DialogTitle className="sr-only">Card Details</DialogTitle>
        <CardHeader cardData={cardData} setCardData={setCardData} />
        {cardData ? (
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 relative">
            <div className="col-span-3">
              <div className="flex gap-3">
                {cardData?.users?.map((user: User) => (
                  <div
                    className="relative after:cursor-pointer after:content-['x'] after:text-xs after:absolute after:right-[-5px] after:top-[-10px] after:bg-red-500 after:h-4 after:w-4 after:flex after:items-center after:justify-center after:text-white after:rounded-full"
                    onClick={() => removeCardMember(user)}
                    key={user.id}
                  >
                    <Image
                      src={user?.image || "/logo.jpg"}
                      alt={user?.name}
                      width={30}
                      height={30}
                      className="h-7 w-7 rounded-full"
                    />
                  </div>
                ))}
                <div className="flex items-center justify-start gap-2">
                  {cardData?.label?.map((item: any) => (
                    <div className="" key={item}>
                      <div
                        className="w-8 h-4 rounded-md"
                        style={{ backgroundColor: getColor(item) }}
                      ></div>
                    </div>
                  ))}
                </div>
                {cardData && cardData.dateTo ? (
                  <CardDate cardData={cardData} boardId={boardId} />
                ) : null}
              </div>
              <div>

              </div>

              <div className="mt-10">
                <CardDescription
                  cardData={cardData}
                  setCardData={setCardData}
                />
                <CardLinks cardData={cardData} setCardData={setCardData} />
                <CardTodo cardData={cardData} setCardData={setCardData} />
                <CardCommentsInput card={cardData} setCardData={setCardData} />
              </div>
            </div>
            <CardActions cardData={cardData} />
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
