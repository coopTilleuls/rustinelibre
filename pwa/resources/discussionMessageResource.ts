import {AbstractResource} from '@resources/AbstractResource';
import {DiscussionMessage} from "@interfaces/DiscussionMessage";

class DiscussionMessageResource extends AbstractResource<DiscussionMessage> {
    protected endpoint = '/discussion_messages';
}

export const discussionMessageResource = new DiscussionMessageResource();
