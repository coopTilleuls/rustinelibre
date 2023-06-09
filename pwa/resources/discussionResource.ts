import {AbstractResource} from '@resources/AbstractResource';
import {Discussion} from "@interfaces/Discussion";

class DiscussionResource extends AbstractResource<Discussion> {
    protected endpoint = '/discussions';
}

export const discussionResource = new DiscussionResource();
