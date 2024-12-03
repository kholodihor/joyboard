import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { removeMemberFromCard } from "@/app/actions/card";
import { labels } from "@/constants/labels";
import { fetcher } from "@/lib/fetcher";
import { User } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import CardActions from "./CardActions";
import CardCommentsInput from "./CardCommentsInput";
import CardDate from "./CardDate";
import CardDescription from "./CardDescription";
import CardHeader from "./CardHeader";
import CardLinks from "./CardLinks";
import CardTodo from "./CardTodo";

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
    if (!user || !cardData) return;

    const updatedCardIds =
      user.cardIds?.filter((id) => id !== cardData.id) || [];
    const updatedUserIds =
      cardData.userIds?.filter((id) => id !== user.id) || [];

    const updatedUser = { ...user, cardIds: updatedCardIds };
    const updatedCard = { ...cardData, userIds: updatedUserIds };

    setCardData(updatedCard);

    await removeMemberFromCard({ user: updatedUser, card: updatedCard });

    window.location.reload();
  };

  console.log(cardData?.users);

  return (
    <Dialog open={isModal} onOpenChange={() => setIsModal(false)}>
      <DialogContent>
        <DialogTitle className="sr-only">Card Details</DialogTitle>
        <CardHeader cardData={cardData} setCardData={setCardData} />
        {cardData ? (
          <div className="relative grid grid-cols-1 md:grid-cols-4 md:gap-4">
            <div className="col-span-3">
              <div className="flex gap-3">
                {cardData?.users?.map((user: User) => (
                  <div
                    className="relative after:absolute after:right-[-5px] after:top-[-10px] after:flex after:h-4 after:w-4 after:cursor-pointer after:items-center after:justify-center after:rounded-full after:bg-red-500 after:text-xs after:text-white after:content-['x']"
                    onClick={() => removeCardMember(user)}
                    key={user.id}
                    title={user?.name}
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
                        className="h-4 w-8 rounded-md"
                        style={{ backgroundColor: getColor(item) }}
                      ></div>
                    </div>
                  ))}
                </div>
                {cardData && cardData.dateTo ? (
                  <CardDate cardData={cardData} boardId={boardId} />
                ) : null}
              </div>
              <div></div>

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
