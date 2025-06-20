"use client";
import { Card,CardContent,CardFooter,CardHeader } from "../ui/card";
import Header from "./header";
import Social from "./Social";


interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
   children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial

}: CardWrapperProps) => {
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <Header label={headerLabel}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social/>
                </CardFooter>
            )}
        </Card>
    );
};