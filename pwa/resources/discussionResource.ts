import {AbstractResource} from '@resources/AbstractResource';
import {Discussion} from "@interfaces/Discussion";
import {RequestHeaders} from "@interfaces/Resource";

class DiscussionResource extends AbstractResource<Discussion> {
    protected endpoint = '/discussions';

    async countUnread(headers?: RequestHeaders): Promise<any> {
        const url = this.getUrl(`/messages_unread`);

        const doFetch = async () => {
            return await fetch(url, {
                headers: {
                    ...this.getDefaultHeaders(),
                    ...headers,
                },
                method: 'GET',
            });
        };

        return await this.getResult(doFetch);
    }

}

export const discussionResource = new DiscussionResource();
