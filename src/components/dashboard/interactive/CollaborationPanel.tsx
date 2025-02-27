
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, MessageSquare, Pin, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChartState } from "../charts/use-chart-state";

export const CollaborationPanel: React.FC = () => {
  const { annotations, selectedAnnotation, setSelectedAnnotation, addReplyToAnnotation } = useChartState();
  const [newComment, setNewComment] = useState("");

  const handleAddReply = () => {
    if (selectedAnnotation && newComment.trim()) {
      addReplyToAnnotation(selectedAnnotation, newComment, "Current User");
      setNewComment("");
    }
  };

  const selectedAnnotationData = selectedAnnotation 
    ? annotations.find(a => a.id === selectedAnnotation) 
    : null;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Collaborative Analysis
        </CardTitle>
        <CardDescription>
          Share insights and discuss chart data with your team
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {annotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
            <Pin className="w-8 h-8 mb-2 opacity-50" />
            <p>No annotations yet</p>
            <p className="text-sm">Click on any chart to add comments and insights</p>
          </div>
        ) : selectedAnnotationData ? (
          <div className="flex flex-col h-full">
            <div className="flex items-start gap-3 mb-4">
              <Avatar>
                <AvatarFallback>{selectedAnnotationData.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{selectedAnnotationData.author}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(selectedAnnotationData.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedAnnotation(null)}
                  >
                    Back
                  </Button>
                </div>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  {selectedAnnotationData.content}
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <ScrollArea className="flex-1 pr-4">
              {selectedAnnotationData.replies.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No replies yet</p>
              ) : (
                <div className="space-y-4">
                  {selectedAnnotationData.replies.map(reply => (
                    <div key={reply.id} className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>
                          <span className="font-medium text-sm">{reply.author}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(reply.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            <div className="mt-4 pt-4 border-t">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your reply..."
                className="min-h-[80px] mb-2"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddReply} disabled={!newComment.trim()}>
                  Post Reply
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {annotations.map(annotation => (
                <div 
                  key={annotation.id} 
                  className="p-3 border rounded-md hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedAnnotation(annotation.id)}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>{annotation.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{annotation.author}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(annotation.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 truncate">{annotation.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      Chart: {annotation.chartId}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageCircle className="w-3 h-3" />
                      <span>{annotation.replies.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
