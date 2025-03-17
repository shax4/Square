package org.shax3.square.domain.proposal.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.shax3.square.domain.proposal.dto.request.CreateProposalRequest;
import org.shax3.square.domain.proposal.dto.response.ProposalResponse;
import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.proposal.repository.ProposalRepository;
import org.shax3.square.domain.user.model.User;
import org.shax3.square.exception.CustomException;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.shax3.square.exception.ExceptionCode.INVALID_REQUEST;

@ExtendWith(MockitoExtension.class)
class ProposalServiceTest {

    @Mock
    private ProposalRepository proposalRepository;

    @InjectMocks
    private ProposalService proposalService;

    private User mockUser;
    private Proposal mockProposal;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .nickname("TestUser")
                .build();
        ReflectionTestUtils.setField(mockUser, "id", 1L);

        mockProposal = Proposal.builder()
                .topic("Sample Proposal")
                .user(mockUser)
                .build();
        ReflectionTestUtils.setField(mockProposal, "id", 1L);
    }

    @Test
    @DisplayName("save success test")
    void save_success() {
        CreateProposalRequest request = new CreateProposalRequest("Sample Proposal");
        ProposalResponse response = proposalService.save(request, "mock-token");

        assertThat(response).isNotNull();
        verify(proposalRepository, times(1)).save(any(Proposal.class));
    }
    @Test
    @DisplayName("save 예외 테스트 - request가 null일 때")
    void save_ShouldThrowException_WhenRequestIsNull() {
        assertThatThrownBy(() -> proposalService.save(null, "mock-token"))
                .isInstanceOf(CustomException.class)
                .extracting(e -> ((CustomException) e).getCode())
                .isEqualTo(INVALID_REQUEST.getCode());
    }

    @Test
    @DisplayName("save 예외 테스트 - topic이 null일 때")
    void save_ShouldThrowException_WhenTopicIsNull() {
        CreateProposalRequest request = new CreateProposalRequest(null);

        assertThatThrownBy(() -> proposalService.save(request, "mock-token"))
                .isInstanceOf(CustomException.class)
                .extracting(e -> ((CustomException) e).getCode())
                .isEqualTo(INVALID_REQUEST.getCode());
    }

    @Test
    @DisplayName("save 예외 테스트 - topic이 빈 문자열일 때")
    void save_ShouldThrowException_WhenTopicIsEmpty() {
        CreateProposalRequest request = new CreateProposalRequest("");

        assertThatThrownBy(() -> proposalService.save(request, "mock-token"))
                .isInstanceOf(CustomException.class)
                .extracting(e -> ((CustomException) e).getCode())
                .isEqualTo(INVALID_REQUEST.getCode());
    }

    @Test
    @DisplayName("save 예외 테스트 - topic이 공백 문자열일 때")
    void save_ShouldThrowException_WhenTopicIsBlankString() {
        CreateProposalRequest request = new CreateProposalRequest("   ");

        assertThatThrownBy(() -> proposalService.save(request, "mock-token"))
                .isInstanceOf(CustomException.class)
                .extracting(e -> ((CustomException) e).getCode())
                .isEqualTo(INVALID_REQUEST.getCode());
    }
}