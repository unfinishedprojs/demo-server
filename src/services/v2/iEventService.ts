import { prisma } from "../../prisma/client";
import { DatabaseError } from "../../errors/DatabaseError";
import { getDiscordData } from "./generateService";
import { InviteEvent } from "@prisma/client";
import { client, env } from "../../app";
import { AnyTextableGuildChannel, Message } from "oceanic.js";

export async function createCEvent(discordId: string, token: string) {
  if (await findCEvent(discordId)) return await voteCEvent(discordId, token);
  else {
    try {
      const result = await prisma.createInviteEvent.create({
        data: {
          discordId: discordId,
          createVote: {
            create: {
              userToken: token,
            },
          },
        },
      });

      return result;
    } catch (error) {
      throw new DatabaseError("Could not create CEvent", error as Error);
    }
  }
}

export async function findCEvent(discordId: string) {
  try {
    const result = await prisma.createInviteEvent.findUnique({
      where: {
        discordId: discordId,
      },
    });

    return result;
  } catch (error) {
    throw new DatabaseError("Could not find unique discordId", error as Error);
  }
}

export async function deleteCEvent(discordId: string) {
  try {
    await prisma.createVote.deleteMany({
      where: { discordId },
    });

    const result = await prisma.createInviteEvent.delete({
      where: {
        discordId: discordId,
      },
    });

    return result;
  } catch (error) {
    throw new DatabaseError("Could not find unique discordId", error as Error);
  }
}

export async function findCVote(discordId: string, token: string) {
  try {
    const result = await prisma.createVote.findUnique({
      where: {
        userToken_discordId: {
          discordId: discordId,
          userToken: token,
        },
      },
    });

    return result;
  } catch (error) {
    throw new DatabaseError("Could not find unique CVote", error as Error);
  }
}

export async function countCVote(discordId: string) {
  try {
    const result = await prisma.createVote.count({
      where: {
        discordId: discordId,
      },
    });

    return result;
  } catch (error) {
    throw new DatabaseError("Could not count CVotes", error as Error);
  }
}

export async function voteCEvent(discordId: string, token: string) {
  try {
    await prisma.createVote.create({
      data: {
        userToken: token,
        discordId: discordId,
      },
    });

    return { discordId };
  } catch (error) {
    throw new DatabaseError("Could not vote on CEvent", error as Error);
  }
}

export async function createIEvent(
  eventId: string,
  discordId: string,
  invite: string,
  duration: number,
) {
  try {
    const user = await getDiscordData(discordId);

    console.log(eventId, discordId, invite);

    const webhook = await client.rest.webhooks.get("1252368511951437846", env.NEWPOLLWEBHOOKTOKEN);

    const message: Message<AnyTextableGuildChannel> = await webhook.execute<AnyTextableGuildChannel>({
      wait: true,
      content: `New poll!`,
      username: "Democracy Shiggy",
      avatarURL: "https://cdn.discordapp.com/avatars/1245513506758066231/a_693566f5bf8e6373cc8d46e5dc9d33d1.gif",
      embeds: [
        {
          title: `New poll has been created for ${user.username}`,
          description: `<@${user.id}> has been suggested enough for a poll to be created. Go vote!`,
          url: `https://demo.samu.lol/#/vote/${eventId}`,
          color: 12082943,
          fields: [
            {
              name: "Poll page",
              value: `https://demo.samu.lol/#/vote/${eventId}`
            },
            {
              name: "Positive votes",
              value: "0",
              inline: true
            },
            {
              name: "Negative votes",
              value: "0",
              inline: true
            }
          ],
          author: {
            name: "Demo-Server",
            url: "https://demo.samu.lol"
          },
          thumbnail: {
            url: user.avatarURL()
          }
        }
      ],
    }, env.NEWPOLLWEBHOOKTOKEN);

    const result = await prisma.inviteEvent.create({
      data: {
        eventId: eventId,
        discordUser: user.globalName,
        discordSlug: user.username,
        discordPfpUrl: user.avatarURL(),
        discordId: discordId,
        invite: invite,
        webhookMessageId: message.id,
        duration: duration,
        endsAt: new Date((new Date()).getTime() + (60 * 60 * 24 * 1000)),
        ended: false,
        positiveVotesInt: 0,
        negativeVotesInt: 0,
      },
    });

    return result as InviteEvent;
  } catch (error) {
    throw new DatabaseError("Could not create IEvent", error as Error);
  }
}

export async function deleteIEvent(eventId: string) {
  try {
    const result = await prisma.inviteEvent.delete({
      where: {
        eventId: eventId,
      },
    });

    return result as InviteEvent;
  } catch (error) {
    throw new DatabaseError("Could not delete IEvent", error as Error);
  }
}

export async function findIEvent(eventId: string) {
  try {
    const result = await prisma.inviteEvent.findUnique({
      where: {
        eventId: eventId,
      },
    });

    return result as InviteEvent;
  } catch (error) {
    throw new DatabaseError("Could not find IEvent", error as Error);
  }
}

export async function findIEventById(discordId: string) {
  try {
    const result = await prisma.inviteEvent.findMany({
      where: {
        discordId: discordId,
      },
    });

    return result as InviteEvent[];
  } catch (error) {
    throw new DatabaseError("Could not find unique discordId", error as Error);
  }
}

export async function iEventVotePos(eventId: string, token: string) {
  try {
    const result = await prisma.positiveVote.create({
      data: {
        userToken: token,
        iEventId: eventId,
      },
    });

    const event = await prisma.inviteEvent.update({
      where: { eventId },
      data: {
        positiveVotesInt: {
          increment: 1,
        },
      },
    });

    if (event.webhookMessageId) {
      const webhook = await client.rest.webhooks.get("1252368511951437846", env.NEWPOLLWEBHOOKTOKEN);

      const message = await webhook.getMessage(event.webhookMessageId as string, undefined, env.NEWPOLLWEBHOOKTOKEN);

      const webhookMessage = await message.editWebhook(env.NEWPOLLWEBHOOKTOKEN as string, {
        content: `New poll!`,
        embeds: [
          {
            title: `New poll has been created for ${event.discordSlug}`,
            description: `<@${event.discordId}> has been suggested enough for a poll to be created. Go vote!`,
            url: `https://demo.samu.lol/#/vote/${eventId}`,
            color: 12082943,
            fields: [
              {
                name: "Poll page",
                value: `https://demo.samu.lol/#/vote/${eventId}`
              },
              {
                name: "Positive votes",
                value: String(event.positiveVotesInt),
                inline: true
              },
              {
                name: "Negative votes",
                value: String(event.negativeVotesInt),
                inline: true
              }
            ],
            author: {
              name: "Demo-Server",
              url: "https://demo.samu.lol"
            },
            thumbnail: {
              url: event.discordPfpUrl as string
            }
          }
        ],
      });
    }

    return result;
  } catch (error) {
    throw new DatabaseError("Could not create iEventVotePos", error as Error);
  }
}

export async function iEventVoteNeg(eventId: string, token: string) {
  try {
    const result = await prisma.negativeVote.create({
      data: {
        userToken: token,
        iEventId: eventId,
      },
    });

    const event = await prisma.inviteEvent.update({
      where: { eventId },
      data: {
        negativeVotesInt: {
          increment: 1,
        },
      },
    });

    if (event.webhookMessageId) {
      const webhook = await client.rest.webhooks.get("1252368511951437846", env.NEWPOLLWEBHOOKTOKEN);

      const message = await webhook.getMessage(event.webhookMessageId as string, undefined, env.NEWPOLLWEBHOOKTOKEN);

      const webhookMessage = await message.editWebhook(env.NEWPOLLWEBHOOKTOKEN as string, {
        content: `New poll!`,
        embeds: [
          {
            title: `New poll has been created for ${event.discordSlug}`,
            description: `<@${event.discordId}> has been suggested enough for a poll to be created. Go vote!`,
            url: `https://demo.samu.lol/#/vote/${eventId}`,
            color: 12082943,
            fields: [
              {
                name: "Poll page",
                value: `https://demo.samu.lol/#/vote/${eventId}`
              },
              {
                name: "Positive votes",
                value: String(event.positiveVotesInt),
                inline: true
              },
              {
                name: "Negative votes",
                value: String(event.negativeVotesInt),
                inline: true
              }
            ],
            author: {
              name: "Demo-Server",
              url: "https://demo.samu.lol"
            },
            thumbnail: {
              url: event.discordPfpUrl as string
            }
          }
        ],
      });
    }

    return result;
  } catch (error) {
    throw new DatabaseError("Could not create iEventVoteNeg", error as Error);
  }
}

export async function iEventVoted(eventId: string, token: string) {
  try {
    const negative = await prisma.negativeVote.findUnique({
      where: {
        userToken_iEventId: {
          userToken: token,
          iEventId: eventId,
        },
      },
    });

    const positive = await prisma.positiveVote.findUnique({
      where: {
        userToken_iEventId: {
          userToken: token,
          iEventId: eventId,
        },
      },
    });

    if (!positive && !negative) return false;
    else return true;
  } catch (error) {
    throw new DatabaseError("Could not accomplish request", error as Error);
  }
}

export async function checkAndUpdateEventStatus() {
  const currentTime = new Date();

  const inviteEvents = await prisma.inviteEvent.findMany({
    where: {
      ended: false
    }
  });

  for (const event of inviteEvents) {
    const eventEndTime = new Date(event.endsAt);

    const webhook = await client.rest.webhooks.get("1252005020820307999", env.WEBHOOKTOKEN);

    if (currentTime > eventEndTime) {
      try {
        await prisma.inviteEvent.update({
          where: { eventId: event.eventId },
          data: { ended: true },
        });

        if (event.positiveVotesInt > event.negativeVotesInt) {
          webhook.execute({ content: `User <@${event.discordId}> got invited. Their invite is \`${event.invite}\`` });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export async function getAllIEvent(active: boolean | undefined) {
  try {
    const result = await prisma.inviteEvent.findMany({
      where: {
        ended: active,
      },
    });

    return result as InviteEvent[];
  } catch (error) {
    throw new DatabaseError("Could not find all IEvents", error as Error);
  }
}

export async function getIEventArraySize(active: boolean | undefined) {
  try {
    const result = await prisma.inviteEvent.count({
      where: {
        ended: active,
      },
    });

    return result as number;
  } catch (error) {
    throw new DatabaseError("Could not count IEvents", error as Error);
  }
}